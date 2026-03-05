'use client';

import type { Locale } from '@/lib/i18n';
import { useI18n } from '@/components/I18nProvider';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { locale, setLocale, t } = useI18n();

    const baseClass = compact
        ? 'h-9 min-w-[84px] rounded-lg px-2.5 text-xs'
        : 'h-10 min-w-[120px] rounded-xl px-3 text-xs md:text-sm';

    return (
        <label className="flex items-center gap-2 text-zinc-300">
            {!compact && <span className="text-[11px] uppercase tracking-widest text-zinc-400">{t('language.label')}</span>}
            <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as Locale)}
                className={`${baseClass} border border-zinc-700 bg-zinc-900/90 text-zinc-100 outline-none transition-colors hover:border-zinc-500 focus:border-[var(--brand)]`}
                aria-label={t('language.label')}
            >
                <option value="es">{t('language.es')}</option>
                <option value="en">{t('language.en')}</option>
                <option value="fr">{t('language.fr')}</option>
            </select>
        </label>
    );
}
