import type { Metadata } from 'next'
import { Barlow_Condensed, Noto_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SupportModal } from '@/components/support-modal'
import { Analytics } from '@vercel/analytics/next'
import QueryProvider from '@/components/query-provider'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-barlow-condensed',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 | Fan Hub',
  description: 'Your ultimate destination for FIFA World Cup 2026. Live scores, brackets, predictions, and more.',
  keywords: 'FIFA, World Cup, 2026, Soccer, Football, USA, Canada, Mexico',
  openGraph: {
    siteName: 'FIFA World Cup 2026 Fan Hub',
  },
  icons: {
    icon: '/img/logoworldcupbaru.ico',
    shortcut: '/img/logoworldcupbaru.ico',
    apple: '/img/logoworldcupbaru.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${barlowCondensed.variable} ${notoSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'FIFA World Cup 2026 Fan Hub',
              url: 'https://www.worldcupfanhub.xyz',
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            <main>{children}</main>
            <Footer />
            <SupportModal />
          </ThemeProvider>
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
