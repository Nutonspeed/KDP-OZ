"use client"

import Link from "next/link"
import { useCallback } from "react"

export function StickyCTA() {
  const handleLead = useCallback(() => {
    window.dataLayer?.push({ event: "lead_request" })
  }, [])

  const handleCall = useCallback(() => {
    window.dataLayer?.push({ event: "click_call" })
  }, [])

  const handleLine = useCallback(() => {
    window.dataLayer?.push({ event: "click_line" })
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:bottom-4 md:right-4 md:left-auto md:w-auto md:rounded">
      <div className="flex justify-around p-2 md:flex-col md:space-y-2">
        <Link
          href="/#contact"
          onClick={handleLead}
          className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded md:min-w-[180px]"
        >
          ขอใบเสนอราคา
        </Link>
        <a
          href="tel:029259633"
          onClick={handleCall}
          className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded md:min-w-[180px]"
        >
          โทรหาเซลล์
        </a>
        <a
          href="https://line.me/R/ti/p/%40kdp-line"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLine}
          className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded md:min-w-[180px]"
        >
          แชท LINE
        </a>
      </div>
    </div>
  )
}
