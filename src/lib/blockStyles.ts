const FONT_MAP: Record<string, string> = {
    Inter: 'var(--font-inter)',
    Roboto: 'var(--font-roboto)',
    'Playfair Display': 'var(--font-playfair)',
    Outfit: 'var(--font-outfit)',
    'DM Sans': 'var(--font-dmsans)',
};

type RawBlockStyles = Record<string, any>;

function normalizeString(value: unknown): string {
    return String(value ?? '').trim();
}

function normalizeRem(value: unknown): string {
    const raw = normalizeString(value);
    if (!raw) return '';
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return '';
    return `${parsed}rem`;
}

function normalizeCssValue(value: unknown): string {
    const raw = normalizeString(value);
    return raw;
}

function normalizeFontFamily(value: unknown): string {
    const raw = normalizeString(value);
    if (!raw) return '';
    return FONT_MAP[raw] || raw;
}

function escapeForCssUrl(value: string): string {
    return value.replace(/'/g, '%27');
}

function clamp(value: number, min: number, max: number): number {
    if (Number.isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function toNumber(value: unknown): number {
    const parsed = Number(String(value ?? '').trim());
    return Number.isFinite(parsed) ? parsed : 0;
}

export function resolveBackgroundOverlay(parsedStyles: RawBlockStyles): { color: string; opacity: number } {
    const color = normalizeCssValue(parsedStyles.backgroundOverlayColor);
    const rawOpacity = toNumber(parsedStyles.backgroundOverlayOpacity);
    const normalizedOpacity = rawOpacity > 1 ? rawOpacity / 100 : rawOpacity;
    const opacity = clamp(normalizedOpacity, 0, 1);
    if (!color || opacity <= 0) return { color: '', opacity: 0 };
    return { color, opacity };
}

export function buildBlockInlineStyles(parsedStyles: RawBlockStyles, imageUrl: string): Record<string, string> {
    const styleObject: Record<string, string> = {};

    const backgroundColor = normalizeCssValue(parsedStyles.backgroundColor);
    if (backgroundColor) styleObject.backgroundColor = backgroundColor;

    if (imageUrl) {
        styleObject.backgroundImage = `url('${escapeForCssUrl(imageUrl)}')`;
        styleObject.backgroundSize = 'cover';
        styleObject.backgroundPosition = 'center';
    }

    const paddingTop = normalizeRem(parsedStyles.paddingTop);
    if (paddingTop) styleObject.paddingTop = paddingTop;

    const paddingBottom = normalizeRem(parsedStyles.paddingBottom);
    if (paddingBottom) styleObject.paddingBottom = paddingBottom;

    const padding = normalizeCssValue(parsedStyles.padding);
    if (padding) styleObject.padding = padding;

    const margin = normalizeCssValue(parsedStyles.margin);
    if (margin) styleObject.margin = margin;

    const textColor = normalizeCssValue(parsedStyles.textColor);
    if (textColor) {
        styleObject.color = textColor;
        styleObject['--text'] = textColor;
        styleObject['--block-text'] = textColor;
    }

    const titleColor = normalizeCssValue(parsedStyles.titleColor);
    if (titleColor) {
        styleObject['--heading'] = titleColor;
        styleObject['--block-heading'] = titleColor;
    }

    const fontSize = normalizeRem(parsedStyles.fontSize);
    if (fontSize) styleObject.fontSize = fontSize;

    const fontFamily = normalizeFontFamily(parsedStyles.fontFamily);
    if (fontFamily) styleObject.fontFamily = fontFamily;

    return styleObject;
}
