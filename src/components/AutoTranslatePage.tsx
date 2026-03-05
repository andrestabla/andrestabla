'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useI18n } from '@/components/I18nProvider';
import type { Locale } from '@/lib/i18n';

const TRANSLATION_STORAGE_KEY = 'atr-translation-cache-v2';
const TRANSLATE_ROOT_SELECTOR = '[data-auto-translate-root="true"]';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;

type TranslationResponseItem = {
    source: string;
    target: string;
};

type TextTarget = {
    type: 'text';
    node: Text;
    source: string;
    normalizedSource: string;
};

type AttrTarget = {
    type: 'attr';
    element: Element;
    attr: (typeof TRANSLATABLE_ATTRIBUTES)[number];
    source: string;
    normalizedSource: string;
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

function normalizeSource(value: string): string {
    return value.trim();
}

function preserveTextNodeSpacing(source: string, translated: string) {
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    return `${leading}${translated}${trailing}`;
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
        const root = document.querySelector<HTMLElement>(TRANSLATE_ROOT_SELECTOR) || document.body;
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
            const normalizedSource = normalizeSource(source);
            if (!isProbablyTranslatable(normalizedSource)) continue;

            targets.push({ type: 'text', node, source, normalizedSource });
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
                const normalizedSource = normalizeSource(source);
                if (!isProbablyTranslatable(normalizedSource)) return;
                targets.push({ type: 'attr', element, attr, source, normalizedSource });
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

            const chunks = chunkArray(missing, 40);
            const responses = await Promise.all(
                chunks.map(async (chunk) => {
                    const response = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ locale: targetLocale, texts: chunk }),
                    });

                    if (!response.ok) {
                        return { chunk, list: [] as TranslationResponseItem[] };
                    }

                    const payload = await response.json().catch(() => ({}));
                    const list: TranslationResponseItem[] = Array.isArray(payload?.translations)
                        ? payload.translations
                        : [];

                    return { chunk, list };
                })
            );

            let cacheChanged = false;
            responses.forEach(({ chunk, list }) => {
                if (list.length > 0) {
                    list.forEach((item) => {
                        if (!item || typeof item.source !== 'string') return;
                        const source = normalizeSource(item.source);
                        const rawTarget = typeof item.target === 'string' ? item.target : source;
                        const target = rawTarget.trim() || source;
                        output.set(source, target);
                        if (target !== source) {
                            cacheRef.current[buildKey(targetLocale, source)] = target;
                            cacheChanged = true;
                        }
                    });
                }

                chunk.forEach((source) => {
                    if (!output.has(source)) {
                        output.set(source, source);
                    }
                });
            });

            if (cacheChanged) {
                persistCache();
            }
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
        const sources = Array.from(
            new Set(
                targets
                    .map((target) => target.normalizedSource)
                    .filter((value) => value.length > 0)
            )
        );
        if (sources.length === 0) return;

        isApplyingRef.current = true;
        try {
            const translatedMap = await requestTranslations(locale, sources);
            if (runId !== runIdRef.current) return;

            targets.forEach((target) => {
                const translatedCore = translatedMap.get(target.normalizedSource) || target.normalizedSource;
                if (target.type === 'text') {
                    if (!target.node.isConnected) return;
                    target.node.textContent = preserveTextNodeSpacing(target.source, translatedCore);
                    return;
                }
                if (!target.element.isConnected) return;
                target.element.setAttribute(target.attr, translatedCore);
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

        const observeRoot = document.querySelector<HTMLElement>(TRANSLATE_ROOT_SELECTOR) || document.body;
        const observer = new MutationObserver(() => {
            if (isApplyingRef.current) return;
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
            }
            debounceRef.current = window.setTimeout(() => {
                runTranslation();
            }, 120);
        });

        observer.observe(observeRoot, {
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
