import type { Metadata } from 'next'
import './globals.css'
import { StatsProvider } from "@/lib/stats-context"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Van Gogh Detective',
  description: 'Test your Van Gogh authentication skills',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StatsProvider>
          {children}
        </StatsProvider>
        <Analytics />
      </body>
    </html>
  )
}
