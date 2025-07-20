'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      className="w-24"
      onClick={() => {
        signOut()
      }}
    >
      Signout
    </button>
  )
}
