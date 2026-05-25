'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import EditorToolbar from './EditorToolbar'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing your story...',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-zinc-300 underline underline-offset-2' },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-editor outline-none' },
    },
  })

  if (!editor) return null

  return (
    <div className="tiptap-editor">
      <EditorToolbar editor={editor} />
      <div className="px-0 py-4">
        <EditorContent editor={editor} />
      </div>
      <div className="pt-3 border-t border-slate-800 text-xs text-slate-600">
        {editor.storage.characterCount.words()} words ·{' '}
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  )
}
