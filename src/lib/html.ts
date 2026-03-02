const BLOCKED_TAGS_REGEX = /<(script|style|iframe|object|embed|link|meta|base)\b[^>]*>[\s\S]*?<\/\1>/gi;
const BLOCKED_SELF_CLOSING_REGEX = /<(script|style|iframe|object|embed|link|meta|base)\b[^>]*\/?>/gi;
const EVENT_HANDLER_ATTR_REGEX = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_PROTOCOL_REGEX = /\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi;

export function sanitizeHtml(value: unknown): string {
    const input = typeof value === 'string' ? value : String(value ?? '');
    return input
        .replace(BLOCKED_TAGS_REGEX, '')
        .replace(BLOCKED_SELF_CLOSING_REGEX, '')
        .replace(EVENT_HANDLER_ATTR_REGEX, '')
        .replace(JS_PROTOCOL_REGEX, ' $1="#"');
}

export function safeHtml(value: unknown, fallback = ''): { __html: string } {
    const content = typeof value === 'string' && value.trim().length > 0 ? value : fallback;
    return { __html: sanitizeHtml(content) };
}
