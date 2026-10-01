import { parseRichText, richTextExtensions } from '@/lib/richText';
import { EditorContent, useEditor } from '@tiptap/react';

export default function RichTextContent({ content, className = '' }) {
    const editor = useEditor({
        content: parseRichText(content),
        editable: false,
        extensions: richTextExtensions(),
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `rich-text-content ${className}`,
            },
        },
    }, [content]);

    if (!content) {
        return null;
    }

    return <EditorContent editor={editor} />;
}
