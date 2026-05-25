import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Code Generator',
  description: 'Generate beautiful code with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#1e1e1e] text-[#cccccc] antialiased">
        {children}
      </body>
    </html>
  )
}
