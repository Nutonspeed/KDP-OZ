export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''

const hasConsent = (): boolean => {
  return typeof window !== 'undefined' && localStorage.getItem('fbPixelConsent') === 'granted'
}

const fbq = (...args: any[]) => {
  if (typeof window === 'undefined' || !hasConsent()) return
  ;(window as any).fbq?.(...args)
}

export const initFacebookPixel = () => {
  if (typeof window === 'undefined' || !FB_PIXEL_ID || (window as any).fbq || !hasConsent()) return
  ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  fbq('init', FB_PIXEL_ID)
}

export const trackFacebookPixel = (event: string, data?: Record<string, any>) => {
  fbq('track', event, data)
}

export const grantFacebookPixelConsent = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('fbPixelConsent', 'granted')
}

export const revokeFacebookPixelConsent = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('fbPixelConsent')
}

export const hasFacebookPixelConsent = hasConsent
