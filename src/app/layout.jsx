/**
 * app/layout.jsx
 *
 * Root layout – wraps every page with the Header, Footer,
 * Google Font links, and global CSS.
 */

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenanceScreen from '@/components/maintenance/MaintenanceScreen'
import { APP_NAME, AGENCY_NAME, REGION } from '@/lib/constants'
import '@/styles/globals.css'

export const metadata = {
  title:       `${APP_NAME} – ${REGION}`,
  description: `${AGENCY_NAME} – One-Stop Platform for MTV Registration and Compliance`,
}

export default function RootLayout({ children }) {
  const maintenanceEnabled = process.env.MAINTENANCE_MODE === 'true'

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {maintenanceEnabled ? (
          <MaintenanceScreen />
        ) : (
          <>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
