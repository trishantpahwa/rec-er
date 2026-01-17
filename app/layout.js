import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Rec-er',
  description: "Trishant Pahwa's blog, journals, records, and researches",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
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
        {children}
      </body>
    </html>
  )
}
