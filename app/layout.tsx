import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  SITE_URL,
} from '@/lib/constants'
import { spaceGrotesk, dmSans, jetbrainsMono } from '@/lib/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'blog',
    'publishing',
    'writly',
    'nextjs',
    'supabase',
    'cms',
    'penulisan',
    'platform blog',
  ],
  authors: [{ name: 'Writly' }],
  creator: 'Writly',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Writly — platform blog modern',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="font-sans bg-zinc-950 text-zinc-100 antialiased min-h-screen">
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  )
}
