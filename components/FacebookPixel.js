'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FacebookPixel() {
  const pathname = usePathname()
  const [loaded, setLoaded] = useState(false)

  // Capture fbclid from URL and persist as _fbc cookie (90 days)
  // Must happen immediately on mount before Next.js router can strip the param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fbclid = params.get('fbclid')
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`
      const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `_fbc=${encodeURIComponent(fbc)};expires=${expires};path=/;SameSite=Lax`
    }
  }, [])

  useEffect(() => {
    if (loaded && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, loaded])

  const pixelScript = [
    '!function(f,b,e,v,n,t,s)',
    '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?',
    'n.callMethod.apply(n,arguments):n.queue.push(arguments)};',
    'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";',
    'n.queue=[];t=b.createElement(e);t.async=!0;',
    't.src=v;s=b.getElementsByTagName(e)[0];',
    's.parentNode.insertBefore(t,s)}(window,document,"script",',
    '"https://connect.facebook.net/en_US/fbevents.js");',
    'fbq("init","2564814423972147");'
  ].join('')

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: pixelScript }}
      onLoad={() => setLoaded(true)}
    />
  )
}