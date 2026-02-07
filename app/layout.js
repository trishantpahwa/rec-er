import Script from 'next/script'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://rec-er.trishantpahwa.com'),
  title: {
    default: 'Rec-er - Trishant Pahwa\'s Blog',
    template: '%s | Rec-er - Trishant Pahwa\'s Blog',
  },
  description: "Trishant Pahwa's blog featuring articles on programming, web development, software engineering, algorithms, and tech insights. Explore coding tutorials, research, and technical journals.",
  keywords: ['programming', 'blog', 'web development', 'software engineering', 'coding', 'technology', 'algorithms', 'JavaScript', 'React', 'Next.js', 'Trishant Pahwa'],
  authors: [{ name: 'Trishant Pahwa', url: 'https://trishantpahwa.com' }],
  creator: 'Trishant Pahwa',
  publisher: 'Trishant Pahwa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rec-er - Trishant Pahwa\'s Blog',
    description: "Trishant Pahwa's blog featuring articles on programming, web development, and software engineering",
    url: 'https://rec-er.trishantpahwa.com',
    siteName: 'Rec-er',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rec-er - Trishant Pahwa\'s Blog',
    description: "Trishant Pahwa's blog featuring articles on programming and technology",
    creator: '@trishantpahwa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G-FTNV0VW653',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FTNV0VW653"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FTNV0VW653');
          `}
        </Script>
        <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Rec-er",
              "alternateName": "Trishant Pahwa's Blog",
              "url": "https://rec-er.trishantpahwa.com",
              "description": "Trishant Pahwa's blog featuring articles on programming, web development, and software engineering",
              "author": {
                "@type": "Person",
                "name": "Trishant Pahwa",
                "url": "https://trishantpahwa.com"
              }
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
