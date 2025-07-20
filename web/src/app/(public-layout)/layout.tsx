import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

export default async function PublicLayout({ children }: PropsWithChildren) {
  const session = await getUser()
  if (session?.user) redirect('/')

  return <>{children}</>
}
