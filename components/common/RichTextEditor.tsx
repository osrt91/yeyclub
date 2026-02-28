"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
  Code2,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded-md p-1.5 transition-colors hover:bg-foreground/10",
        isActive && "bg-yey-turquoise/20 text-yey-turquoise"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-foreground/15" />;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl my-6" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose min-h-[300px] max-w-none px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Görsel URL:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-foreground/20 bg-background transition-colors focus-within:border-yey-turquoise focus-within:ring-1 focus-within:ring-yey-turquoise">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-foreground/15 bg-foreground/[0.03] px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Kalın"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="İtalik"
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Başlık 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Başlık 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Madde listesi"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numaralı liste"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Görsel ekle">
          <ImageIcon size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Kod bloğu"
        >
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Alıntı"
        >
          <Quote size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Geri al"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="İleri al"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
