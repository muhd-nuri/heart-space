"use client"

import { useState } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  name: string
  defaultValue?: string
  placeholder?: string
}

/**
 * TipTap rich-text editor for the news CMS. Output is HTML stored in the
 * `content` column. The hidden input keeps the latest HTML in sync so
 * the surrounding native form picks it up on submit (no controlled-state
 * gymnastics needed in the parent form).
 */
export function TipTapEditor({ name, defaultValue = "", placeholder }: Props) {
  const [html, setHtml] = useState(defaultValue)
  const editor = useEditor({
    immediatelyRender: false, // SSR-safe in Next 16
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: defaultValue || `<p></p>`,
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-[280px] max-w-none px-5 py-4 focus:outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  })

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-hairline)] bg-white focus-within:border-[var(--color-teal)]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return (
      <div className="h-[42px] border-b border-[var(--color-hairline)] bg-[var(--color-ash)]" />
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-hairline)] bg-[var(--color-ash)] px-2 py-1.5">
      <TextBtn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </TextBtn>
      <TextBtn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H3
      </TextBtn>
      <TextBtn
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragraph"
      >
        ¶
      </TextBtn>
      <Sep />
      <IconBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold size={14} strokeWidth={2.4} />
      </IconBtn>
      <IconBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline code"
      >
        <Code size={14} strokeWidth={2.2} />
      </IconBtn>
      <Sep />
      <IconBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <List size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        <ListOrdered size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        <Quote size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <Minus size={14} strokeWidth={2.4} />
      </IconBtn>
      <Sep />
      <IconBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo2 size={14} strokeWidth={2.2} />
      </IconBtn>
      <IconBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo2 size={14} strokeWidth={2.2} />
      </IconBtn>
    </div>
  )
}

function btnBase(active?: boolean, disabled?: boolean) {
  return cn(
    "grid h-7 min-w-7 place-items-center rounded px-2 transition-colors",
    active
      ? "bg-[var(--color-teal)] text-white"
      : "text-[var(--color-ink-soft)] hover:bg-white",
    disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
  )
}

function IconBtn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      className={btnBase(active, disabled)}
    >
      {children}
    </button>
  )
}

function TextBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        btnBase(active),
        "font-display text-[0.8rem] font-bold tracking-tight"
      )}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-[var(--color-hairline)]" />
}
