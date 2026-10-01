import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import StarterKit from '@tiptap/starter-kit';

const EMPTY_DOCUMENT = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};

function plainTextToDocument(value) {
    const lines = String(value).replace(/\r\n/g, '\n').split('\n');
    const content = [];

    lines.forEach((line, index) => {
        if (line) {
            content.push({ type: 'text', text: line });
        }

        if (index < lines.length - 1) {
            content.push({ type: 'hardBreak' });
        }
    });

    return {
        type: 'doc',
        content: [{
            type: 'paragraph',
            ...(content.length ? { content } : {}),
        }],
    };
}

export function parseRichText(value) {
    if (!value) {
        return EMPTY_DOCUMENT;
    }

    try {
        const parsed = JSON.parse(value);

        if (parsed?.type === 'doc' && Array.isArray(parsed.content)) {
            return parsed;
        }
    } catch {
        // Existing problems are plain text and remain fully supported.
    }

    return plainTextToDocument(value);
}

export function serializeRichText(editor) {
    return editor.isEmpty ? '' : JSON.stringify(editor.getJSON());
}

export function richTextExtensions({ editable = false } = {}) {
    return [
        StarterKit.configure({
            heading: { levels: [2, 3] },
            link: {
                autolink: true,
                defaultProtocol: 'https',
                openOnClick: !editable,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            },
        }),
        Superscript,
        Subscript,
        Image.configure({
            allowBase64: false,
            HTMLAttributes: {
                loading: 'lazy',
            },
        }),
    ];
}
