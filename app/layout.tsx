import type React from "react"
import type { Metadata } from "next"
import { Inter, Sarabun } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LiveChatWidget } from "@/components/LiveChatWidget"
import { FacebookPixel } from "@/components/FacebookPixel"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
})

export const metadata: Metadata = {
  title: "O-Z/Gedney Conduit Body | KDP Engineering & Supply",
  description: "ผู้จำหน่าย O-Z/Gedney Conduit Body คุณภาพสูง มาตรฐาน UL และ NEMA สำหรับงานไฟฟ้าอุตสาหกรรม",
  keywords: "conduit body, O-Z Gedney, KDP Engineering, อุปกรณ์ไฟฟ้า, อุตสาหกรรม",
  openGraph: {
    title: "O-Z/Gedney Conduit Body | KDP Engineering & Supply",
    description: "ผู้จำหน่าย O-Z/Gedney Conduit Body คุณภาพสูง มาตรฐาน UL และ NEMA",
    url: "https://kdp-conduit.vercel.app",
    siteName: "KDP Engineering & Supply",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "O-Z/Gedney Conduit Body | KDP Engineering & Supply",
    description: "ผู้จำหน่าย O-Z/Gedney Conduit Body คุณภาพสูง มาตรฐาน UL และ NEMA",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} ${sarabun.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FacebookPixel />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LiveChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
