'use client';

import { useEffect, useRef } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link as LinkIcon,
    Heading2,
    Pilcrow
} from 'lucide-react';

type RichTextFieldProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeightClass?: string;
    singleLine?: boolean;
    className?: string;
};

type ToolButtonProps = {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
};

function ToolButton({ label, onClick, children }: ToolButtonProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            title={label}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex items-center justify-center"
        >
            {children}
        </button>
    );
}

export default function RichTextField({
    value,
    onChange,
    placeholder = 'Escribe aquí...',
    minHeightClass = 'min-h-[96px]',
    singleLine = false,
    className = ''
}: RichTextFieldProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<Range | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;
        const incoming = value || '';
        if (editorRef.current.innerHTML !== incoming) {
            editorRef.current.innerHTML = incoming;
        }
    }, [value]);

    const emitChange = () => {
        onChange(editorRef.current?.innerHTML || '');
    };

    const saveSelection = () => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) return;
        selectionRef.current = range.cloneRange();
    };

    const restoreSelection = () => {
        if (!selectionRef.current) return;
        const selection = window.getSelection();
        if (!selection) return;
        selection.removeAllRanges();
        selection.addRange(selectionRef.current);
    };

    const runCommand = (command: string, commandValue?: string) => {
        const editor = editorRef.current;
        if (!editor) return;
        if (document.activeElement !== editor) {
            editor.focus();
        }
        restoreSelection();
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(command, false, commandValue);
        emitChange();
        saveSelection();
    };

    const handleInsertLink = () => {
        saveSelection();
        const url = window.prompt('URL del enlace');
        if (!url) return;
        runCommand('createLink', url);
    };

    return (
        <div className={`rounded-lg border border-slate-200 bg-white overflow-hidden ${className}`}>
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                <ToolButton label="Párrafo" onClick={() => runCommand('formatBlock', '<p>')}>
                    <Pilcrow size={14} />
                </ToolButton>
                <ToolButton label="Título H2" onClick={() => runCommand('formatBlock', '<h2>')}>
                    <Heading2 size={14} />
                </ToolButton>
                <ToolButton label="Negrita" onClick={() => runCommand('bold')}>
                    <Bold size={14} />
                </ToolButton>
                <ToolButton label="Cursiva" onClick={() => runCommand('italic')}>
                    <Italic size={14} />
                </ToolButton>
                <ToolButton label="Subrayado" onClick={() => runCommand('underline')}>
                    <Underline size={14} />
                </ToolButton>
                {!singleLine && (
                    <>
                        <ToolButton label="Lista" onClick={() => runCommand('insertUnorderedList')}>
                            <List size={14} />
                        </ToolButton>
                        <ToolButton label="Lista numerada" onClick={() => runCommand('insertOrderedList')}>
                            <ListOrdered size={14} />
                        </ToolButton>
                    </>
                )}
                <ToolButton label="Enlace" onClick={handleInsertLink}>
                    <LinkIcon size={14} />
                </ToolButton>
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder={placeholder}
                className={`rich-html w-full p-3 text-sm text-slate-700 outline-none focus:bg-indigo-50/30 transition-colors prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ${minHeightClass}`}
                onInput={emitChange}
                onBlur={() => {
                    emitChange();
                    saveSelection();
                }}
                onFocus={saveSelection}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onKeyDown={(e) => {
                    if (singleLine && e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
            />
            <style jsx>{`
                div[contenteditable='true']:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
