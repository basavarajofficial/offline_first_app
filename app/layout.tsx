import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Offline-First CRUD App with RxDB",
  description: "A React application with offline-first capabilities using RxDB and MongoDB Atlas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster richColors duration={2000} offset={16} />
        </ThemeProvider>
      </body>
    </html>
  )
}
