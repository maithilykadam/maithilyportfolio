import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const DOT_SIZE = 12
const RING_SIZE_BUTTON = 20
const NAVY = '#1e3a8a'

// Simple open-eye outline — the reference pill's icon, redrawn as an
// inline SVG so it can inherit `currentColor` (white, via the pill's own
// `color`) instead of needing a separate image asset.
function EyeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// `button` (every other clickable — links, nav words, resume, etc.) uses
// the same soft/translucent language on the ring rather than a solid
// opaque stroke — a solid ring was cutting right across small link text.
const DOT_VARIANTS = {
  default: { width: DOT_SIZE, height: DOT_SIZE, opacity: 1 },
  ring: { width: DOT_SIZE, height: DOT_SIZE, opacity: 0 },
  button: { width: DOT_SIZE, height: DOT_SIZE, opacity: 0 },
}

const RING_VARIANTS = {
  default: { width: 0, height: 0, opacity: 0, border: `1.5px solid rgba(30, 58, 138, 0)` },
  ring: { width: 0, height: 0, opacity: 0, border: `1.5px solid rgba(30, 58, 138, 0)` },
  button: {
    width: RING_SIZE_BUTTON,
    height: RING_SIZE_BUTTON,
    opacity: 1,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    border: '1px solid rgba(30, 58, 138, 0.5)',
  },
}

/**
 * Replaces the system cursor with a small solid navy circle that trails
 * the real pointer position with a light spring (rather than snapping
 * 1:1), so it feels like a soft dot following you rather than a raw
 * cursor swap. Mounted once at the Shell level (see Shell.jsx) so it
 * persists across every panel instead of remounting per page.
 *
 * Reacts to whatever's under the pointer via `data-cursor-hover`'s value:
 *   default — the plain dot.
 *   button — every other clickable (links, nav words, resume, etc.): a
 *     small soft ring around a hidden dot.
 *   ring — case studies specifically: the dot/ring both hide and a solid
 *     "VIEW CASE STUDY" pill (navy, matching the reference mockup's shape
 *     — pill + eye icon + label — just navy instead of orange) takes
 *     over completely instead of coexisting with a shape cursor.
 *
 * All three layers sit in one positioned wrapper that tracks the pointer,
 * so they're always concentric regardless of which is visible — centered
 * via a CSS `translate: -50% -50%` on the wrapper (a distinct property
 * from `transform`, so it composes with Framer's x/y spring instead of
 * fighting it) rather than baking a size offset into x/y.
 *
 * The system cursor itself is hidden globally via `cursor: none` in
 * index.css — this is the only thing standing in for it, so it needs to
 * track fast enough not to feel laggy (see the spring config below) and
 * sit on a very high z-index so nothing else in the page can render
 * over it.
 */
export default function CustomCursor() {
  const [variant, setVariant] = useState('default')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 700, damping: 40, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 700, damping: 40, mass: 0.25 })

  useEffect(() => {
    const handleMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const handleOver = (e) => {
      const target = e.target.closest?.('[data-cursor-hover]')
      if (target) setVariant(target.getAttribute('data-cursor-hover'))
    }
    const handleOut = (e) => {
      if (e.target.closest?.('[data-cursor-hover]')) setVariant('default')
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout', handleOut)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout', handleOut)
    }
  }, [x, y])

  const isPill = variant === 'ring'

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        x: springX,
        y: springY,
        translate: '-50% -50%',
      }}
    >
      {/* Ring — button hover only now; the case-study ring was replaced
          by the pill below. */}
      <motion.div
        animate={RING_VARIANTS[variant] ?? RING_VARIANTS.default}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ position: 'absolute', top: 0, left: 0, translate: '-50% -50%', borderRadius: '50%' }}
      />
      {/* Dot — resting cursor, hidden for both the ring and button hovers. */}
      <motion.div
        animate={DOT_VARIANTS[variant] ?? DOT_VARIANTS.default}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          translate: '-50% -50%',
          borderRadius: '50%',
          backgroundColor: NAVY,
        }}
      />
      {/* Pill — case-study hover. Scales/fades in rather than just
          appearing, and stays centered on the pointer like the other two
          layers (unlike the reference mockup's cursor-plus-trailing-pill,
          this fully replaces the cursor since the system arrow is already
          hidden site-wide). */}
      <motion.div
        initial={false}
        animate={{ opacity: isPill ? 1 : 0, scale: isPill ? 1 : 0.8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          translate: '-50% -50%',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '999px',
          background: NAVY,
          color: '#ffffff',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)',
        }}
      >
        <EyeIcon size={12} />
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          VIEW CASE STUDY
        </span>
      </motion.div>
    </motion.div>
  )
}
