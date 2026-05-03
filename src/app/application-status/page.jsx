import { redirect } from 'next/navigation'

export default function ApplicationStatusPage({ searchParams }) {
  const ref = searchParams?.ref

  if (ref) {
    redirect(`/apply?ref=${encodeURIComponent(ref)}#application-status`)
  }

  redirect('/apply#application-status')
}
