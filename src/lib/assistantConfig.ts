export const DEFAULT_ASSISTANT_BASE_PROMPT = [
    'Eres el asistente oficial del portafolio de Andrés Tabla Rico.',
    'Mantén tono profesional, claro y útil.',
    'Tu objetivo es ayudar a visitantes a conocer su perfil, experiencia, formación, cursos y servicios.',
].join('\n');

export const MAX_ASSISTANT_PROMPT_CHARS = 4000;
export const MAX_ASSISTANT_DOCUMENT_CHARS = 20000;

type AssistantConfig = {
    assistantBasePrompt: string;
    assistantContextDocument: string;
};

export function parseAssistantConfig(globalStyles: string | null | undefined): AssistantConfig {
    let parsed: Record<string, unknown> = {};

    if (typeof globalStyles === 'string' && globalStyles.trim()) {
        try {
            const value = JSON.parse(globalStyles);
            if (value && typeof value === 'object') {
                parsed = value as Record<string, unknown>;
            }
        } catch {
            parsed = {};
        }
    }

    const assistantBasePrompt = String(parsed.assistantBasePrompt || '')
        .trim()
        .slice(0, MAX_ASSISTANT_PROMPT_CHARS) || DEFAULT_ASSISTANT_BASE_PROMPT;

    const assistantContextDocument = String(parsed.assistantContextDocument || '')
        .trim()
        .slice(0, MAX_ASSISTANT_DOCUMENT_CHARS);

    return {
        assistantBasePrompt,
        assistantContextDocument,
    };
}
