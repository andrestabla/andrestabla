'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE_KEY,
    LOCALE_STORAGE_KEY,
    resolveLocale,
    t as translate,
    type Locale,
    type MessageKey,
    type MessageParams,
} from '@/lib/i18n';

type I18nContextValue = {
    locale: Locale;
    setLocale: (nextLocale: Locale) => void;
    t: (key: MessageKey, params?: MessageParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
    children: ReactNode;
    initialLocale?: Locale;
};

export default function I18nProvider({ children, initialLocale = DEFAULT_LOCALE }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(initialLocale));

    useEffect(() => {
        const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        if (!storedValue) return;
        const storedLocale = resolveLocale(storedValue);
        setLocaleState((currentLocale) =>
            currentLocale === storedLocale ? currentLocale : storedLocale
        );
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    }, [locale]);

    const setLocale = useCallback((nextLocale: Locale) => {
        setLocaleState(resolveLocale(nextLocale));
    }, []);

    const translateMessage = useCallback(
        (key: MessageKey, params?: MessageParams) => translate(locale, key, params),
        [locale]
    );

    const value = useMemo<I18nContextValue>(
        () => ({ locale, setLocale, t: translateMessage }),
        [locale, setLocale, translateMessage]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n debe usarse dentro de I18nProvider.');
    }
    return context;
}
