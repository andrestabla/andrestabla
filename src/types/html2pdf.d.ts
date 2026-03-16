declare module 'html2pdf.js' {
    export type Html2PdfOptions = {
        margin?: number | [number, number] | [number, number, number, number];
        filename?: string;
        image?: {
            type?: 'jpeg' | 'png' | 'webp';
            quality?: number;
        };
        enableLinks?: boolean;
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            backgroundColor?: string | null;
        };
        jsPDF?: {
            unit?: 'pt' | 'mm' | 'cm' | 'in' | 'px';
            format?: string | [number, number];
            orientation?: 'portrait' | 'landscape';
        };
        pagebreak?: {
            mode?: string | string[];
            before?: string | string[];
            after?: string | string[];
            avoid?: string | string[];
        };
    };

    export type Html2PdfWorker = {
        set(options: Html2PdfOptions): Html2PdfWorker;
        from(source: HTMLElement | string, type?: 'element' | 'string'): Html2PdfWorker;
        save(filename?: string): Promise<void>;
    };

    type Html2PdfFactory = {
        (): Html2PdfWorker;
        (source: HTMLElement, options?: Html2PdfOptions): Promise<void>;
    };

    const html2pdf: Html2PdfFactory;
    export default html2pdf;
}
