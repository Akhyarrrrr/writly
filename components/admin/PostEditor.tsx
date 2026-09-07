'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TiptapEditor from '@/components/editor/TiptapEditor'
import { toast } from 'sonner'
import { findOrCreateCategory } from '@/lib/categories'
import { generateSlug, estimateReadTime } from '@/lib/utils'
import { inputClass, selectClass, labelClass, panelClass } from '@/lib/ui'
import { Save, Globe, Eye, Upload, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/utils'
import type { Post, Category, PostFormData } from '@/types'

const CUSTOM_CATEGORY = '__custom__'

interface Props {
  post?: Post
  categories: Category[]
  userId: string
}

export default function PostEditor({ post, categories, userId }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const isEditing = !!post

  const [form, setForm] = useState<PostFormData>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image_url: post?.cover_image_url || '',
    category_id: post?.category_id || '',
    status: post?.status || 'draft',
    featured: post?.featured || false,
    tags: [],
  })

  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [titleTouched, setTitleTouched] = useState(isEditing)
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState('')
  const [currentPostId, setCurrentPostId] = useState(post?.id || '')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const [dirty, setDirty] = useState(false)
  const hydrated = useRef(false)
  const lastPersisted = useRef(JSON.stringify(form))
  const recoveryKey = `writly:draft:${post?.id || 'new'}`

  useEffect(() => {
    const raw = window.localStorage.getItem(recoveryKey)
    if (raw) {
      try {
        const recovery = JSON.parse(raw) as { form: PostFormData; savedAt: string }
        if (!post || new Date(recovery.savedAt) > new Date(post.updated_at)) {
          window.setTimeout(() => {
            setForm(recovery.form)
            toast.info('Recovered unsaved writing from this browser.')
          }, 0)
        }
      } catch {
        window.localStorage.removeItem(recoveryKey)
      }
    }
    hydrated.current = true
  }, [post, recoveryKey])

  useEffect(() => {
    if (!hydrated.current) return
    const serialized = JSON.stringify(form)
    const changed = serialized !== lastPersisted.current
    setDirty(changed)
    if (changed) {
      window.localStorage.setItem(recoveryKey, JSON.stringify({ form, savedAt: new Date().toISOString() }))
      setSaveState('idle')
    }
  }, [form, recoveryKey])

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [dirty])

  useEffect(() => {
    if (!dirty || !currentPostId || form.status !== 'draft' || useCustomCategory) return
    if (!form.title.trim() || !form.slug.trim()) return

    const timer = window.setTimeout(async () => {
      setSaveState('saving')
      const { error } = await supabase
        .from('posts')
        .update({
          title: form.title.trim(),
          slug: form.slug.trim(),
          excerpt: form.excerpt.trim() || null,
          content: form.content,
          cover_image_url: form.cover_image_url.trim() || null,
          category_id: form.category_id || null,
          featured: form.featured,
          read_time: estimateReadTime(form.content),
        })
        .eq('id', currentPostId)
        .eq('author_id', userId)

      if (error) setSaveState('failed')
      else {
        lastPersisted.current = JSON.stringify(form)
        window.localStorage.removeItem(recoveryKey)
        setDirty(false)
        setSaveState('saved')
      }
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [currentPostId, dirty, form, recoveryKey, supabase, useCustomCategory, userId])

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    const toastId = toast.loading('Uploading cover...')
    const filename = `covers/${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, file)
    if (error) {
      toast.error('Upload failed', { id: toastId })
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(filename)
      setForm((prev) => ({ ...prev, cover_image_url: publicUrl }))
      toast.success('Cover uploaded', { id: toastId })
    }
    setUploadingCover(false)
  }

  async function saveDraft(reviewAfter = false) {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required')
      return
    }
    if (!form.content.trim() || form.content === '<p></p>') {
      toast.error('Content is required')
      return
    }

    setSaving(true)
    const toastId = toast.loading(reviewAfter ? 'Preparing review...' : 'Saving draft...')

    let categoryId: string | null = form.category_id || null

    if (useCustomCategory) {
      if (!customCategoryName.trim()) {
        toast.error('Enter a custom category name', { id: toastId })
        setSaving(false)
        return
      }
      const result = await findOrCreateCategory(supabase, customCategoryName)
      if ('error' in result) {
        toast.error(result.error, { id: toastId })
        setSaving(false)
        return
      }
      categoryId = result.id
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_image_url: form.cover_image_url.trim() || null,
      category_id: categoryId,
      status: 'draft' as const,
      featured: form.featured,
      read_time: estimateReadTime(form.content),
      published_at: post?.published_at || null,
      author_id: userId,
    }

    const { data, error } = currentPostId
      ? await supabase
          .from('posts')
          .update(payload)
          .eq('id', currentPostId)
          .eq('author_id', userId)
          .select()
          .single()
      : await supabase.from('posts').insert(payload).select().single()

    if (error) {
      const msg = error.message.includes('permission denied')
        ? 'You do not have permission to save this post.'
        : error.message.includes('unique')
          ? 'Slug already exists. Try a different one.'
          : error.message
      toast.error(msg, { id: toastId })
    } else {
      const savedForm = { ...form, status: 'draft' as const }
      setForm(savedForm)
      setCurrentPostId(data.id)
      lastPersisted.current = JSON.stringify(savedForm)
      window.localStorage.removeItem(recoveryKey)
      setDirty(false)
      setSaveState('saved')
      await supabase.from('post_revisions').insert({
        post_id: data.id,
        author_id: userId,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        cover_image_url: data.cover_image_url,
      })
      toast.success(reviewAfter ? 'Draft ready for review.' : 'Draft saved', { id: toastId })
      if (reviewAfter) router.push(`/admin/posts/${data.id}/review`)
      else if (!currentPostId) router.replace(`/admin/posts/${data.id}/edit`)
      else router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap border-b border-zinc-800/80 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">
            {isEditing ? 'Editing' : 'Compose'}
          </p>
          <h1 className="font-display text-xl font-semibold text-white tracking-tight">
            {isEditing ? 'Edit post' : 'New post'}
          </h1>
          {isEditing && (
            <p className="text-sm text-zinc-500 mt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1',
                  post?.status === 'published'
                    ? 'text-zinc-300'
                    : 'text-zinc-500'
                )}
              >
                {post?.status === 'published' ? 'Published' : 'Draft'}
              </span>
              {' · '}
              Updated{' '}
              {new Date(post?.updated_at || '').toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-500" aria-live="polite">
            {saveState === 'saving' && 'Saving changes...'}
            {saveState === 'saved' && 'All changes saved'}
            {saveState === 'failed' && 'Autosave failed. Your browser recovery copy is still available.'}
            {saveState === 'idle' && dirty && 'Unsaved changes'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {form.status === 'published' && form.slug && (
            <Link
              href={`/blog/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg transition cursor-pointer"
            >
              <Globe size={14} />
              View live
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye size={14} />
            {previewMode ? 'Editor' : 'Preview'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => saveDraft(false)}
            disabled={saving}
          >
            <Save size={14} />
            Save draft
          </Button>
          <Button size="sm" onClick={() => saveDraft(true)} disabled={saving}>
            <Globe size={14} />
            Review & publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-5 min-w-0">
          {form.cover_image_url ? (
            <div className="relative rounded-xl overflow-hidden aspect-video border border-zinc-800/80">
              <img
                src={form.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove cover image"
                onClick={() =>
                  setForm((prev) => ({ ...prev, cover_image_url: '' }))
                }
                className="absolute top-3 right-3 p-1.5 bg-zinc-950/80 hover:bg-zinc-950 text-zinc-200 rounded-lg border border-zinc-700 transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/30 transition">
              <Upload size={18} className="text-zinc-600 mb-2" />
              <span className="text-sm text-zinc-500">Add cover image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={uploadingCover}
              />
            </label>
          )}

          <input
            id="post-title"
            aria-label="Post title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value
              setForm((prev) => ({
                ...prev,
                title,
                slug: titleTouched ? prev.slug : generateSlug(title),
              }))
            }}
            placeholder="Post title"
            className="w-full bg-transparent font-display text-3xl font-semibold text-white placeholder-zinc-700 outline-none tracking-tight"
          />

          <textarea
            id="post-excerpt"
            aria-label="Post excerpt"
            value={form.excerpt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            placeholder="Short excerpt for previews and SEO"
            rows={2}
            className="w-full bg-transparent text-zinc-400 placeholder-zinc-600 outline-none resize-none text-base leading-relaxed"
          />

          <div className="border-t border-zinc-800/80 pt-6">
            {previewMode ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            ) : (
              <TiptapEditor
                content={form.content}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content }))
                }
              />
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className={panelClass()}>
            <label htmlFor="post-slug" className={labelClass}>URL slug</label>
            <input
              id="post-slug"
              value={form.slug}
              onChange={(e) => {
                setTitleTouched(true)
                setForm((prev) => ({
                  ...prev,
                  slug: generateSlug(e.target.value),
                }))
              }}
              placeholder="post-url-slug"
              className={inputClass}
            />
            <p className="text-xs text-zinc-600 mt-2 font-mono">
              /blog/{form.slug || 'your-slug'}
            </p>
          </div>

          <div className={panelClass()}>
            <label htmlFor="post-category" className={labelClass}>Category</label>
            <div className="relative">
              <select
                id="post-category"
                value={useCustomCategory ? CUSTOM_CATEGORY : form.category_id}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === CUSTOM_CATEGORY) {
                    setUseCustomCategory(true)
                    setForm((prev) => ({ ...prev, category_id: '' }))
                  } else {
                    setUseCustomCategory(false)
                    setCustomCategoryName('')
                    setForm((prev) => ({ ...prev, category_id: value }))
                  }
                }}
                className={cn(selectClass, 'pr-9')}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value={CUSTOM_CATEGORY}>Custom — type your own</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
            </div>
            {useCustomCategory && (
              <input
                id="custom-category"
                aria-label="Custom category name"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="e.g. Productivity, Travel, Design..."
                className={cn(inputClass, 'mt-3')}
                autoFocus
              />
            )}
            {useCustomCategory && (
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Kategori baru akan dibuat otomatis saat post disimpan.
              </p>
            )}
            {categories.length === 0 && !useCustomCategory && (
              <p className="text-xs text-amber-500/90 mt-2 leading-relaxed">
                Belum ada kategori. Pilih &quot;Custom&quot; atau jalankan{' '}
                <code className="bg-zinc-800 px-1 rounded">supabase/schema.sql</code>.
              </p>
            )}
          </div>

          <div className={panelClass()}>
            <p className={labelClass}>Options</p>
            <Toggle
              label="Featured on homepage"
              checked={form.featured}
              onChange={(featured) => setForm((prev) => ({ ...prev, featured }))}
            />
          </div>

          <div className={panelClass()}>
            <label htmlFor="cover-url" className={labelClass}>Cover URL</label>
            <input
              id="cover-url"
              value={form.cover_image_url}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cover_image_url: e.target.value,
                }))
              }
              placeholder="https://..."
              className={cn(inputClass, 'text-xs font-mono')}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
