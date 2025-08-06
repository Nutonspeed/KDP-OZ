"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    fbq: any
  }
}

export function FacebookPixel() {
  useEffect(() => {
    // Facebook Pixel Code
    const script = document.createElement("script")
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1234567890123456');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)

    // Noscript fallback
    const noscript = document.createElement("noscript")
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1234567890123456&ev=PageView&noscript=1" />
    `
    document.head.appendChild(noscript)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(noscript)
    }
  }, [])

  return null
}

// Facebook Pixel tracking functions
export const fbPixelTrack = {
  // Track page view
  pageView: () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView")
    }
  },

  // Track product view
  viewContent: (contentName: string, value?: number) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: contentName,
        value: value,
        currency: "THB",
      })
    }
  },

  // Track add to cart
  addToCart: (contentName: string, value: number, quantity: number = 1) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: contentName,
        value: value,
        currency: "THB",
        quantity: quantity,
      })
    }
  },

  // Track lead generation
  lead: (contentName?: string) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: contentName || "Contact Form",
      })
    }
  },

  // Track purchase
  purchase: (value: number, contentIds: string[] = []) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: "THB",
        content_ids: contentIds,
      })
    }
  },

  // Track custom event
  customEvent: (eventName: string, parameters: any = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", eventName, parameters)
    }
  },
}

// Legacy exports for backward compatibility
export const trackPurchase = fbPixelTrack.purchase
export const trackLead = fbPixelTrack.lead
export const trackAddToCart = fbPixelTrack.addToCart
