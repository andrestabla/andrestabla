import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { absoluteUrl, stripHtml } from '@/lib/seo';

type BlockRecord = {
    type: string;
    order: number;
    data: string;
};

type ParsedBlock = {
    type: string;
    order: number;
    data: any;
};

type ContactLink = {
    label: string;
    url: string;
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 34,
        paddingBottom: 42,
        paddingHorizontal: 38,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#0f172a',
        lineHeight: 1.5,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
    },
    greeting: {
        fontSize: 9,
        color: '#0284c7',
        letterSpacing: 1.4,
        textTransform: 'uppercase',
    },
    name: {
        marginTop: 6,
        fontSize: 28,
        fontWeight: 700,
        color: '#020617',
        lineHeight: 1.1,
    },
    role: {
        marginTop: 8,
        fontSize: 13,
        color: '#334155',
        lineHeight: 1.4,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 14,
    },
    contactItem: {
        marginRight: 14,
        marginBottom: 6,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        color: '#0f172a',
        fontSize: 9,
    },
    linksWrap: {
        marginTop: 12,
    },
    linksTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    linkLine: {
        fontSize: 10,
        color: '#0369a1',
        marginBottom: 4,
        textDecoration: 'none',
    },
    section: {
        marginTop: 18,
    },
    sectionTitle: {
        marginBottom: 8,
        fontSize: 11,
        fontWeight: 700,
        color: '#0284c7',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    paragraph: {
        fontSize: 11,
        color: '#1e293b',
        lineHeight: 1.55,
        marginBottom: 6,
    },
    entry: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    entryMeta: {
        fontSize: 9,
        fontWeight: 700,
        color: '#0284c7',
        marginBottom: 3,
    },
    entryTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#020617',
        lineHeight: 1.3,
    },
    entrySubtitle: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 3,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    entryBody: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.5,
    },
    muted: {
        color: '#64748b',
    },
});

function decodeBasicEntities(value: string) {
    return value
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}

function htmlToPdfText(value: unknown) {
    return decodeBasicEntities(String(value || ''))
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|section|article|h1|h2|h3|h4|h5|h6)>/gi, '\n\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/(ul|ol)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function splitParagraphs(value: unknown) {
    return htmlToPdfText(value)
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
}

function parseBlocks(blocks: BlockRecord[]): ParsedBlock[] {
    return [...blocks]
        .sort((a, b) => a.order - b.order)
        .map((block) => {
            try {
                return { ...block, data: JSON.parse(block.data || '{}') };
            } catch {
                return { ...block, data: {} };
            }
        });
}

function renderParagraphs(value: unknown, style: any = styles.paragraph) {
    return splitParagraphs(value).map((paragraph, index) => (
        <Text key={`${paragraph.slice(0, 24)}-${index}`} style={style}>
            {paragraph}
        </Text>
    ));
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{stripHtml(title || '')}</Text>
            {children}
        </View>
    );
}

export function buildResumePdfFilename(fullName: string) {
    const slug = stripHtml(fullName || 'hoja de vida')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();

    return `${slug || 'hoja-de-vida'}.pdf`;
}

export function ResumePdfDocument({ blocks }: { blocks: BlockRecord[] }) {
    const parsedBlocks = parseBlocks(blocks);
    const hero = parsedBlocks.find((block) => block.type === 'hero')?.data || {};
    const contactLinks: ContactLink[] = Array.isArray(hero.links)
        ? hero.links
            .map((link: any) => ({
                label: stripHtml(link?.label || ''),
                url: String(link?.url || '').trim(),
            }))
            .filter((link: ContactLink) => Boolean(link.label && link.url))
        : [];
    const socialLinks: ContactLink[] = parsedBlocks
        .filter((block) => block.type === 'social')
        .flatMap((block) =>
            Array.isArray(block.data?.items)
                ? block.data.items.map((item: any) => ({
                    label: stripHtml(item?.network || 'enlace'),
                    url: String(item?.url || '').trim(),
                }))
                : []
        )
        .filter((link: ContactLink) => Boolean(link.url));
    const portfolioItems = parsedBlocks
        .filter((block) => block.type === 'portfolio')
        .flatMap((block) => (Array.isArray(block.data?.items) ? block.data.items : []))
        .filter((item: any) => item?.title);
    const fullName = stripHtml(hero.name || 'Andrés Tabla Rico');

    return (
        <Document
            title={`HV de ${fullName}`}
            author={fullName}
            subject="Hoja de vida"
            creator="andrestabla.com"
            language="es-CO"
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {hero.greeting ? <Text style={styles.greeting}>{stripHtml(hero.greeting)}</Text> : null}
                    <Text style={styles.name}>{fullName}</Text>
                    {hero.role ? <Text style={styles.role}>{htmlToPdfText(hero.role)}</Text> : null}

                    <View style={styles.contactRow}>
                        {hero.phone ? <Text style={styles.contactItem}>{stripHtml(hero.phone)}</Text> : null}
                        {hero.email ? <Text style={styles.contactItem}>{stripHtml(hero.email)}</Text> : null}
                        <Text style={styles.contactItem}>{absoluteUrl('/')}</Text>
                    </View>

                    {contactLinks.length > 0 ? (
                        <View style={styles.linksWrap}>
                            <Text style={styles.linksTitle}>Sitios y proyectos</Text>
                            {contactLinks.map((link) => (
                                <Link key={`${link.label}-${link.url}`} src={absoluteUrl(link.url)} style={styles.linkLine}>
                                    {`${link.label}: ${absoluteUrl(link.url)}`}
                                </Link>
                            ))}
                        </View>
                    ) : null}
                </View>

                {parsedBlocks.map((block) => {
                    if (block.type === 'richtext') {
                        const title = stripHtml(block.data?.title || '');
                        const paragraphs = splitParagraphs(block.data?.content);
                        if (!title || paragraphs.length === 0) return null;

                        return (
                            <Section key={`${block.type}-${block.order}`} title={title}>
                                {paragraphs.map((paragraph, index) => (
                                    <Text key={`${title}-${index}`} style={styles.paragraph}>
                                        {paragraph}
                                    </Text>
                                ))}
                            </Section>
                        );
                    }

                    if (block.type === 'timeline') {
                        const items = Array.isArray(block.data?.items) ? block.data.items : [];
                        if (items.length === 0) return null;

                        return (
                            <Section key={`${block.type}-${block.order}`} title={block.data?.title || 'Experiencia'}>
                                {items.map((item: any, index: number) => (
                                    <View key={`${item?.title || 'item'}-${index}`} style={styles.entry} wrap={false}>
                                        {item?.meta ? <Text style={styles.entryMeta}>{stripHtml(item.meta)}</Text> : null}
                                        <Text style={styles.entryTitle}>{stripHtml(item?.title || 'Experiencia')}</Text>
                                        {item?.subtitle ? <Text style={styles.entrySubtitle}>{stripHtml(item.subtitle)}</Text> : null}
                                        <Text style={styles.entryBody}>{htmlToPdfText(item?.body)}</Text>
                                    </View>
                                ))}
                            </Section>
                        );
                    }

                    if (block.type === 'bento') {
                        const items = Array.isArray(block.data?.items) ? block.data.items : [];
                        if (items.length === 0) return null;

                        return (
                            <Section key={`${block.type}-${block.order}`} title={block.data?.title || 'Formación'}>
                                {items.map((item: any, index: number) => (
                                    <View key={`${item?.title || 'item'}-${index}`} style={styles.entry} wrap={false}>
                                        {item?.meta ? <Text style={styles.entryMeta}>{stripHtml(item.meta)}</Text> : null}
                                        <Text style={styles.entryTitle}>{stripHtml(item?.title || 'Formación')}</Text>
                                        {item?.subtitle ? <Text style={styles.entrySubtitle}>{stripHtml(item.subtitle)}</Text> : null}
                                        {htmlToPdfText(item?.body) ? <Text style={styles.entryBody}>{htmlToPdfText(item?.body)}</Text> : null}
                                    </View>
                                ))}
                            </Section>
                        );
                    }

                    return null;
                })}

                {portfolioItems.length > 0 ? (
                    <Section title="Proyectos destacados">
                        {portfolioItems.slice(0, 6).map((item: any, index: number) => (
                            <View key={`${item?.title || 'proyecto'}-${index}`} style={styles.entry} wrap={false}>
                                <Text style={styles.entryTitle}>{stripHtml(item?.title || 'Proyecto')}</Text>
                                {item?.category ? <Text style={styles.entrySubtitle}>{stripHtml(item.category)}</Text> : null}
                                {item?.hoverText ? renderParagraphs(item.hoverText, styles.entryBody) : null}
                                {item?.link ? (
                                    <Link src={absoluteUrl(String(item.link))} style={styles.linkLine}>
                                        {absoluteUrl(String(item.link))}
                                    </Link>
                                ) : null}
                            </View>
                        ))}
                    </Section>
                ) : null}

                {socialLinks.length > 0 ? (
                    <Section title="Redes y contacto">
                        {socialLinks.map((link) => (
                            <Link key={`${link.label}-${link.url}`} src={absoluteUrl(link.url)} style={styles.linkLine}>
                                {`${link.label}: ${absoluteUrl(link.url)}`}
                            </Link>
                        ))}
                    </Section>
                ) : null}

                <View style={styles.section}>
                    <Text style={[styles.paragraph, styles.muted]}>
                        Documento generado automáticamente desde {absoluteUrl('/')}.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
