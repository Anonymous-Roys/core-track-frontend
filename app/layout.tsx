import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CoreTrack',
    template: '%s • CoreTrack',
  },
  description: 'Core logging and drilling operations dashboard for geology teams.',
  applicationName: 'CoreTrack',
  keywords: [
    'core logging',
    'geology',
    'drilling',
    'operations dashboard',
    'lithology',
    'samples',
  ],
  authors: [{ name: 'CoreTrack' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'CoreTrack',
    description: 'Log cores, monitor drilling, and manage operations in one place.',
    url: 'https://coretrack.app',
    siteName: 'CoreTrack',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 512,
        height: 512,
        alt: 'CoreTrack Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CoreTrack',
    description: 'Log cores, monitor drilling, and manage operations in one place.',
    images: ['/placeholder-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
