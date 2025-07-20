'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'

export default function ToggleTheme() {
  const [mounted, setMounted] = useState<boolean>(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {theme == 'light' ? (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme('dark')}
        >
          <MoonIcon className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme('light')}
        >
          <SunIcon className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
