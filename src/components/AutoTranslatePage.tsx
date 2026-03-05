'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useI18n } from '@/components/I18nProvider';
import type { Locale } from '@/lib/i18n';

const TRANSLATION_STORAGE_KEY = 'atr-translation-cache-v1';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;

type TranslationResponseItem = {
    source: string;
    target: string;
};

type TextTarget = {
    type: 'text';
    node: Text;
    source: string;
};

type AttrTarget = {
    type: 'attr';
    element: Element;
    attr: (typeof TRANSLATABLE_ATTRIBUTES)[number];
    source: string;
};

type Target = TextTarget | AttrTarget;

function isProbablyTranslatable(value: string): boolean {
    const text = value.trim();
    if (!text) return false;
    if (text.length < 2 || text.length > 1200) return false;
    if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) return false;
    if (/^#[0-9a-f]{3,8}$/i.test(text)) return false;
    if (/^[\d\s\W_]+$/.test(text)) return false;
    return true;
}

function buildKey(locale: Locale, source: string) {
    return `${locale}::${source}`;
}

function chunkArray<T>(values: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let idx = 0; idx < values.length; idx += size) {
        chunks.push(values.slice(idx, idx + size));
    }
    return chunks;
}

export default function AutoTranslatePage() {
    const { locale } = useI18n();

    const textOriginalsRef = useRef<Map<Text, string>>(new Map());
    const attrOriginalsRef = useRef<Map<Element, Record<string, string>>>(new Map());
    const isApplyingRef = useRef(false);
    const runIdRef = useRef(0);
    const observerRef = useRef<MutationObserver | null>(null);
    const debounceRef = useRef<number | null>(null);
    const cacheRef = useRef<Record<string, string>>({});
    const cacheLoadedRef = useRef(false);

    const ensureCacheLoaded = useCallback(() => {
        if (cacheLoadedRef.current) return;
        cacheLoadedRef.current = true;
        try {
            const raw = window.localStorage.getItem(TRANSLATION_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                cacheRef.current = parsed as Record<string, string>;
            }
        } catch (_error) {
            cacheRef.current = {};
        }
    }, []);

    const persistCache = useCallback(() => {
        try {
            window.localStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(cacheRef.current));
        } catch (_error) {
            // Ignore cache persistence errors
        }
    }, []);

    const restoreOriginals = useCallback(() => {
        textOriginalsRef.current.forEach((source, node) => {
            if (!node.isConnected) return;
            node.textContent = source;
        });

        attrOriginalsRef.current.forEach((attrs, element) => {
            if (!element.isConnected) return;
            for (const [attr, source] of Object.entries(attrs)) {
                element.setAttribute(attr, source);
            }
        });
    }, []);

    const collectTargets = useCallback((): Target[] => {
        const root = document.body;
        if (!root) return [];

        const targets: Target[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            const parent = node.parentElement;
            if (!parent) continue;
            if (parent.closest('script, style, noscript, code, pre, textarea')) continue;
            if (parent.closest('[data-no-auto-translate="true"]')) continue;

            if (!textOriginalsRef.current.has(node)) {
                textOriginalsRef.current.set(node, node.textContent || '');
            }
            const source = textOriginalsRef.current.get(node) || '';
            if (!isProbablyTranslatable(source)) continue;

            targets.push({ type: 'text', node, source });
        }

        const elements = root.querySelectorAll<Element>('[placeholder], [title], [aria-label], img[alt]');
        elements.forEach((element) => {
            if (element.closest('[data-no-auto-translate="true"]')) return;
            const existing = attrOriginalsRef.current.get(element) || {};
            let hasAny = false;

            TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
                const value = element.getAttribute(attr);
                if (!value) return;
                if (!existing[attr]) {
                    existing[attr] = value;
                }
                const source = existing[attr];
                if (!isProbablyTranslatable(source)) return;
                targets.push({ type: 'attr', element, attr, source });
                hasAny = true;
            });

            if (hasAny) {
                attrOriginalsRef.current.set(element, existing);
            }
        });

        return targets;
    }, []);

    const requestTranslations = useCallback(
        async (targetLocale: Locale, sources: string[]): Promise<Map<string, string>> => {
            ensureCacheLoaded();
            const output = new Map<string, string>();
            const missing: string[] = [];

            sources.forEach((source) => {
                const key = buildKey(targetLocale, source);
                const cached = cacheRef.current[key];
                if (cached) {
                    output.set(source, cached);
                } else {
                    missing.push(source);
                }
            });

            if (missing.length === 0) return output;

            const chunks = chunkArray(missing, 80);
            for (const chunk of chunks) {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ locale: targetLocale, texts: chunk }),
                });

                if (!response.ok) {
                    chunk.forEach((source) => output.set(source, source));
                    continue;
                }

                const payload = await response.json().catch(() => ({}));
                const list: TranslationResponseItem[] = Array.isArray(payload?.translations)
                    ? payload.translations
                    : [];

                if (list.length === 0) {
                    chunk.forEach((source) => output.set(source, source));
                    continue;
                }

                list.forEach((item) => {
                    if (!item || typeof item.source !== 'string') return;
                    const source = item.source;
                    const target = typeof item.target === 'string' ? item.target : source;
                    output.set(source, target);
                    cacheRef.current[buildKey(targetLocale, source)] = target;
                });

                chunk.forEach((source) => {
                    if (!output.has(source)) {
                        output.set(source, source);
                    }
                });
            }

            persistCache();
            return output;
        },
        [ensureCacheLoaded, persistCache]
    );

    const runTranslation = useCallback(async () => {
        const runId = ++runIdRef.current;

        if (locale === 'es') {
            restoreOriginals();
            return;
        }

        const targets = collectTargets();
        const sources = Array.from(new Set(targets.map((target) => target.source)));
        if (sources.length === 0) return;

        isApplyingRef.current = true;
        try {
            const translatedMap = await requestTranslations(locale, sources);
            if (runId !== runIdRef.current) return;

            targets.forEach((target) => {
                const translated = translatedMap.get(target.source) || target.source;
                if (target.type === 'text') {
                    if (!target.node.isConnected) return;
                    target.node.textContent = translated;
                    return;
                }
                if (!target.element.isConnected) return;
                target.element.setAttribute(target.attr, translated);
            });
        } finally {
            isApplyingRef.current = false;
        }
    }, [collectTargets, locale, requestTranslations, restoreOriginals]);

    useEffect(() => {
        runTranslation();
    }, [runTranslation]);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        if (locale === 'es') {
            return;
        }

        const observer = new MutationObserver(() => {
            if (isApplyingRef.current) return;
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
            }
            debounceRef.current = window.setTimeout(() => {
                runTranslation();
            }, 120);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
        });

        observerRef.current = observer;

        return () => {
            observer.disconnect();
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [locale, runTranslation]);

    return null;
}
