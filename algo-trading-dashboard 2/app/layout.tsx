import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from "@/components/toast-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlgoTrade - Algorithmic Trading Dashboard",
  description: "A modern dashboard for algorithmic trading",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
