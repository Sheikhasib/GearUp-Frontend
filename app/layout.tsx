import { Geist, Geist_Mono, Oxanium } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/app/providers/query-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import type { ReactNode } from "react"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", oxanium.variable, geistHeading.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
