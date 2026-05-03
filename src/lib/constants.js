/**
 * lib/constants.js
 * App-wide constants for the MTV Portal System
 */

export const APP_NAME    = 'MTV Portal System'
export const AGENCY_NAME = 'National Meat Inspection Service'
export const REGION      = 'Central Luzon Regional Office (RTOC III)'
export const COPYRIGHT   = `© ${new Date().getFullYear()} NMIS RTOC III. All rights reserved.`

export const NAV_ITEMS = [
  { id: 'home',    href: '/',                    icon: '🏠', label: 'Home'           },
  { id: 'ghp',     href: '/ghp',                 icon: '▶️', label: 'GHP Orientation' },
  { id: 'apply',   href: '/apply',               icon: '📋', label: 'MTV Application' },
  { id: 'verify',  href: '/verify',              icon: '🔍', label: 'Verify MTV'      },
  { id: 'banned',  href: '/banned',              icon: '🚫', label: 'Banned List'     },
  { id: 'contact', href: '/contact',             icon: '✉️', label: 'Contact'         },
]

export const OFFICE_INFO = {
  name:    'NMIS Central Luzon Regional Office',
  address: 'San Agustin, City of San Fernando, Pampanga, Philippines 2000',
  phone:   '(045) 123-4567',
  email:   'nmis.clu@da.gov.ph',
  hours:   'Monday–Friday: 8:00 AM – 5:00 PM (Except Public Holidays)',
}

// File upload constraints
export const MAX_FILE_SIZE       = 5 * 1024 * 1024   // 5 MB
export const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png'

export const DEMO_FAQS = [
  {
    q: 'How long does the accreditation process take?',
    a: 'The accreditation process typically takes 5–10 working days after submission of complete requirements.',
  },
  {
    q: 'What is the validity of the MTV Certificate of Registration?',
    a: 'The Certificate of Registration (COR) is valid for one (1) year from the date of issuance.',
  },
  {
    q: 'Do I need to complete the GHP Orientation before applying?',
    a: 'Yes, you need to complete the GHP Orientation and obtain your certificate number before submitting your MTV application.',
  },
  {
    q: 'What documents are required for MTV accreditation?',
    a: 'Required documents include: GHP Certificate, OR/CR, Bill of Lading, LTO Inspection Certificate, Business Permit, and a valid government-issued ID.',
  },
  {
    q: 'How can I check the status of my application?',
    a: 'You can check your application status in the MTV Application page using your reference number.',
  },
]
