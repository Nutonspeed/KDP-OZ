"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  grantFacebookPixelConsent,
  hasFacebookPixelConsent,
  initFacebookPixel,
  trackFacebookPixel,
} from "@/lib/facebookPixel"

export function TrackingConsent() {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    const granted = hasFacebookPixelConsent()
    setConsent(granted)
    if (granted) {
      initFacebookPixel()
    }
  }, [])

  if (consent) return null

  const accept = () => {
    grantFacebookPixelConsent()
    initFacebookPixel()
    trackFacebookPixel("PageView")
    setConsent(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-2 z-50 text-sm">
      <span>We use cookies for analytics. Do you consent to Facebook Pixel tracking?</span>
      <Button onClick={accept}>Accept</Button>
    </div>
  )
}
