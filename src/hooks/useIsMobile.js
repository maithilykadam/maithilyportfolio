import { useEffect, useState } from 'react'

// Below this width, pages get a real, separately-designed mobile layout
// (see HomeMobile.jsx, MobileBottomBar.jsx) instead of the desktop layout
// just scaled down via rpx(). 700px covers phones (including large ones —
// an iPhone Pro Max is ~430 CSS px) without catching tablets: a portrait
// iPad is 768px+, so it still gets the desktop layout, which has actual
// room for the side-by-side/absolute-positioned design.
//
// rpx() itself is part of why "just scaled down" looked bad below phone
// widths in the first place: it scales every value by the same
// width-relative ratio regardless of the value's own size, so a 23px
// tagline (ratio ~1.6vw) shrinks to something like 6px on a 375px-wide
// phone even though a 170px heading (ratio ~11.8vw) still looks like a
// reasonable ~44px — the same formula degenerates very differently
// depending on how small the base value already is. Below this
// breakpoint, mobile-specific components use their own fixed sizing
// instead of rpx() for exactly that reason.
const MOBILE_BREAKPOINT = 700

/**
 * True when the viewport is at or below MOBILE_BREAKPOINT. Backed by
 * matchMedia (not a resize listener + manual width comparison), so it only
 * triggers a re-render when the boolean actually flips across the
 * breakpoint, not on every pixel of a window resize.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const handleChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
