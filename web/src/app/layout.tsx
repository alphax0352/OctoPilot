import type { Metadata } from 'next'
import { TanstackQueryProvider } from '@/providers/tanstack-query-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import NextAuthProvider from '@/providers/session-provider'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Octopilot',
  description: 'Octopilot - Your AI-Powered Auto Job Application and Tracking Assistant',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <NextAuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackQueryProvider>
              {children}
              <Toaster />
            </TanstackQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  )
}
