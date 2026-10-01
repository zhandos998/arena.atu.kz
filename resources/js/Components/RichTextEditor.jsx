import { parseRichText, richTextExtensions, serializeRichText } from '@/lib/richText';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import axios from 'axios';
import { useRef, useState } from 'react';

function ToolbarButton({ active = false, children, disabled = false, onClick, title }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${active
                ? 'bg-[#355da8] text-white dark:bg-[#91b8ff] dark:text-[#10264f]'
                : 'text-[#405674] hover:bg-[#edf3ff] dark:text-[#c7d5e8] dark:hover:bg-[#203858]'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ id, value, onChange, allowImages = false, minHeight = '220px' }) {
    const imageInput = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const editor = useEditor({
        content: parseRichText(value),
        extensions: richTextExtensions({ editable: true }),
        immediatelyRender: false,
        editorProps: {
            attributes: {
                id,
                class: 'rich-text-content min-h-[inherit] px-4 py-3 text-sm text-[#405674] outline-none dark:text-[#c7d5e8]',
            },
        },
        onUpdate: ({ editor: currentEditor }) => onChange(serializeRichText(currentEditor)),
    });
    const state = useEditorState({
        editor,
        selector: ({ editor: currentEditor }) => ({
            bold: currentEditor?.isActive('bold') ?? false,
            italic: currentEditor?.isActive('italic') ?? false,
            underline: currentEditor?.isActive('underline') ?? false,
            superscript: currentEditor?.isActive('superscript') ?? false,
            subscript: currentEditor?.isActive('subscript') ?? false,
            heading2: currentEditor?.isActive('heading', { level: 2 }) ?? false,
            heading3: currentEditor?.isActive('heading', { level: 3 }) ?? false,
            bulletList: currentEditor?.isActive('bulletList') ?? false,
            orderedList: currentEditor?.isActive('orderedList') ?? false,
            blockquote: currentEditor?.isActive('blockquote') ?? false,
            codeBlock: currentEditor?.isActive('codeBlock') ?? false,
            link: currentEditor?.isActive('link') ?? false,
        }),
    }) ?? {};

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href ?? '';
        const url = window.prompt('Введите адрес ссылки', previousUrl);

        if (url === null || !editor) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const uploadImage = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file || !editor) return;

        setUploading(true);
        setUploadError('');

        try {
            const body = new FormData();
            body.append('image', file);
            const response = await axios.post(route('admin.problem-images.store'), body, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            editor.chain().focus().setImage({ src: response.data.url, alt: file.name }).run();
        } catch (error) {
            setUploadError(error.response?.data?.errors?.image?.[0] ?? 'Не удалось загрузить изображение.');
        } finally {
            setUploading(false);
        }
    };

    if (!editor) {
        return <div className="mt-2 animate-pulse rounded-xl bg-[#edf1f7] dark:bg-[#20304a]" style={{ minHeight }} />;
    }

    return (
        <div className="mt-2">
            <div className="overflow-hidden rounded-xl border border-[#ccd7e8] bg-white shadow-sm focus-within:border-[#355da8] focus-within:ring-1 focus-within:ring-[#355da8] dark:border-[#3a506e] dark:bg-[#142238] dark:focus-within:border-[#91b8ff] dark:focus-within:ring-[#91b8ff]">
                <div className="flex flex-wrap items-center gap-1 border-b border-[#dfe7f3] bg-[#f8faff] p-2 dark:border-[#2d405b] dark:bg-[#17263e]">
                    <ToolbarButton title="Обычный текст" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>P</ToolbarButton>
                    <ToolbarButton title="Заголовок" active={state.heading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
                    <ToolbarButton title="Подзаголовок" active={state.heading3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
                    <span className="mx-1 h-6 w-px bg-[#d7e0ed] dark:bg-[#3a506e]" />
                    <ToolbarButton title="Жирный" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarButton>
                    <ToolbarButton title="Курсив" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
                    <ToolbarButton title="Подчёркнутый" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarButton>
                    <ToolbarButton title="Верхний индекс — например, 10⁵" active={state.superscript} onClick={() => editor.chain().focus().toggleSuperscript().run()}>x<sup>2</sup></ToolbarButton>
                    <ToolbarButton title="Нижний индекс — например, aᵢ" active={state.subscript} onClick={() => editor.chain().focus().toggleSubscript().run()}>x<sub>2</sub></ToolbarButton>
                    <span className="mx-1 h-6 w-px bg-[#d7e0ed] dark:bg-[#3a506e]" />
                    <ToolbarButton title="Маркированный список" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolbarButton>
                    <ToolbarButton title="Нумерованный список" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
                    <ToolbarButton title="Цитата" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</ToolbarButton>
                    <ToolbarButton title="Блок кода" active={state.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</ToolbarButton>
                    <ToolbarButton title="Ссылка" active={state.link} onClick={setLink}>🔗</ToolbarButton>
                    {allowImages && (
                        <>
                            <ToolbarButton title="Добавить изображение" disabled={uploading} onClick={() => imageInput.current?.click()}>{uploading ? '…' : 'Фото'}</ToolbarButton>
                            <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadImage} />
                        </>
                    )}
                    <span className="mx-1 h-6 w-px bg-[#d7e0ed] dark:bg-[#3a506e]" />
                    <ToolbarButton title="Отменить" disabled={!editor.can().chain().focus().undo().run()} onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarButton>
                    <ToolbarButton title="Повторить" disabled={!editor.can().chain().focus().redo().run()} onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarButton>
                </div>
                <div style={{ minHeight }}>
                    <EditorContent editor={editor} />
                </div>
            </div>

            {allowImages && (
                <p className={`mt-2 text-xs ${uploadError ? 'font-bold text-red-600 dark:text-red-300' : 'text-[#8795a9] dark:text-[#a4b6cf]'}`}>
                    {uploadError || 'Фото: JPG, PNG или WebP, до 5 МБ и 4096×4096 пикселей.'}
                </p>
            )}
        </div>
    );
}
