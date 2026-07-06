import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Outfit } from 'next/font/google'
import './globals.css'

const fontSans = Outfit({ variable: '--font-sans', subsets: ['latin'] })
const fontHeading = Space_Grotesk({ variable: '--font-heading', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyberGuardian | CyberPeace',
  description:
    'CyberGuardian by CyberPeace — your front line in cyber hygiene and digital defense.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a1020',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} bg-background`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const accent = localStorage.getItem('db-accent-color')
                if (accent) {
                  document.documentElement.style.setProperty('--db-accent', accent)
                  document.documentElement.style.setProperty('--db-accent-light', accent + '14')
                  document.documentElement.style.setProperty('--db-accent-mid', accent + '26')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
