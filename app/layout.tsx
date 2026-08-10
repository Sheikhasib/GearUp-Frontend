import { Geist, Geist_Mono, Oxanium } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/app/providers/query-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "GearUp — Why Buy When You Can Rent?",
    template: "%s · GearUp",
  },
  description:
    "GearUp is a rental marketplace to find and rent bikes, camping gear, water sports and more from trusted local providers.",
  applicationName: "GearUp",
  keywords: [
    "gear rental",
    "bike rental",
    "camping gear",
    "outdoor gear",
    "GearUp",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#0e9f6e",
  width: "device-width",
  initialScale: 1,
}

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
            <Toaster richColors closeButton position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
