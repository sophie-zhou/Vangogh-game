import type { Metadata } from 'next'
import './globals.css'
import { StatsProvider } from "@/lib/stats-context"
import { LearningProvider } from "@/lib/learning-context"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'VanGotcha!: Van Gogh Detective',
  description: 'Test your Van Gogh authentication skills',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StatsProvider>
          <LearningProvider>
            {children}
          </LearningProvider>
        </StatsProvider>
        <Analytics />
      </body>
    </html>
  )
}
