'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ToolbarProps {
  editor: Editor
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition duration-200 text-sm cursor-pointer ${
        active
          ? 'bg-zinc-700 text-white'
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  async function handleImageUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const toastId = toast.loading('Uploading image...')
      const supabase = createClient()
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

      const { error } = await supabase.storage
        .from('blog-images')
        .upload(filename, file)
      if (error) {
        toast.error('Upload failed', { id: toastId })
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(filename)
      editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run()
      toast.success('Image uploaded', { id: toastId })
    }
    input.click()
  }

  function setLink() {
    const url = window.prompt('Enter URL:', 'https://')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-lg mb-4 sticky top-16 z-10 backdrop-blur-md">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={15} />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet list"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered list"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote size={15} />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="Inline code"
      >
        <Code size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code block"
      >
        <Code2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <Minus size={15} />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Insert link"
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={handleImageUpload} title="Upload image">
        <ImageIcon size={15} />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-800 mx-1 ml-auto" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={15} />
      </ToolbarButton>
    </div>
  )
}
