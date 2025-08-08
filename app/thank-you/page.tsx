"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function ThankYouPage() {
  useEffect(() => {
    window.dataLayer?.push({ event: "contact_submit" })
  }, [])

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4 font-sarabun">ขอบคุณสำหรับการติดต่อ</h1>
      <p className="mb-8">ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
      <Link href="/" className="text-blue-600 underline">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  )
}
