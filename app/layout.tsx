import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Sarabun } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LiveChatWidget } from "@/components/LiveChatWidget"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { StickyCTA } from "@/components/StickyCTA"
import { TrackingConsent } from "@/components/TrackingConsent"
import { products } from "@/lib/mockData"

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
  icons: {
    icon: "/placeholder-logo.svg",
  },
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KDP Engineering & Supply",
    url: "https://kdp-conduit.vercel.app",
    logo: "/placeholder-logo.png",
  }

  const productListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 8).map((p, i) => ({
      "@type": "Product",
      name: p.name,
      position: i + 1,
    })),
  }

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <Script id="gtm-datalayer" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');`}
        </Script>
        <Script id="jsonld-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script id="jsonld-products" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(productListJsonLd)}
        </Script>
      </head>
      <body className={`${inter.className} ${sarabun.variable}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LiveChatWidget />
          <StickyCTA />
          <Toaster />
          <TrackingConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
