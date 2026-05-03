/**
 * app/layout.jsx
 *
 * Root layout – wraps every page with the Header, Footer,
 * Google Font links, and global CSS.
 */

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { APP_NAME, AGENCY_NAME, REGION } from '@/lib/constants'
import '@/styles/globals.css'

export const metadata = {
  title:       `${APP_NAME} – ${REGION}`,
  description: `${AGENCY_NAME} – One-Stop Platform for MTV Registration and Compliance`,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
