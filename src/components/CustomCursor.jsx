import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const DOT_SIZE = 12
const RING_SIZE_BUTTON = 20
const RING_SIZE_INVERT = 24
const BADGE_SIZE = 32
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

// Diagonal "opens in a new view" arrow — used by the `expand` badge
// instead of a text label, for triggers packed too close together for a
// wide pill to read cleanly (see PlayContent.jsx).
function ArrowUpRightIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
      <path d="M7 17 17 7" strokeLinecap="round" />
      <path d="M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
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
  expand: { width: DOT_SIZE, height: DOT_SIZE, opacity: 0 },
  invert: { width: DOT_SIZE, height: DOT_SIZE, opacity: 0 },
}

const RING_VARIANTS = {
  default: { width: 0, height: 0, opacity: 0, border: `1.5px solid rgba(30, 58, 138, 0)` },
  ring: { width: 0, height: 0, opacity: 0, border: `1.5px solid rgba(30, 58, 138, 0)` },
  expand: { width: 0, height: 0, opacity: 0, border: `1.5px solid rgba(30, 58, 138, 0)` },
  button: {
    width: RING_SIZE_BUTTON,
    height: RING_SIZE_BUTTON,
    opacity: 1,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    border: '1px solid rgba(30, 58, 138, 0.5)',
  },
  // Any image/video/colored preview — not one of the more specific states
  // above — gets a plain white circle with a navy stroke instead of the
  // solid navy dot, so the cursor stays visible over busy or dark imagery
  // instead of disappearing into it.
  invert: {
    width: RING_SIZE_INVERT,
    height: RING_SIZE_INVERT,
    opacity: 1,
    backgroundColor: '#ffffff',
    border: `1.5px solid ${NAVY}`,
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
 *     pill (navy, matching the reference mockup's shape — pill + eye icon
 *     + label — just navy instead of orange) takes over completely
 *     instead of coexisting with a shape cursor. The pill's label text is
 *     read from the hovered element's own `data-cursor-label` attribute
 *     (falling back to "VIEW CASE STUDY").
 *   expand — same idea as `ring` (opens into its own full view) but for
 *     triggers packed too close together for a wide text pill to read
 *     cleanly without constantly overlapping its neighbors (the
 *     playground pieces) — a small solid navy circle with a plain
 *     diagonal arrow, no label.
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
  const [label, setLabel] = useState('VIEW CASE STUDY')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 700, damping: 40, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 700, damping: 40, mass: 0.25 })
  const location = useLocation()

  // A click that navigates (e.g. a case-study box) removes the hovered
  // element from the DOM instead of the mouse ever actually leaving it, so
  // no `mouseout` ever fires — without this, whatever hover variant was
  // showing (the "VIEW CASE STUDY" pill, a button ring, ...) stays stuck
  // on screen after the click, floating over content that was never
  // meant to trigger it. Resetting on every route change covers it.
  useEffect(() => {
    setVariant('default')
  }, [location.pathname])

  useEffect(() => {
    const handleMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const handleOver = (e) => {
      const target = e.target.closest?.('[data-cursor-hover]')
      if (target) {
        setVariant(target.getAttribute('data-cursor-hover'))
        setLabel(target.getAttribute('data-cursor-label') ?? 'VIEW CASE STUDY')
        return
      }
      // No explicit data-cursor-hover state on anything up the tree — but
      // an <img>/<video> is never just the page's own flat background
      // color, so it still gets its own state (see `invert` above) instead
      // of leaving the plain dot to run straight over screenshots, hero
      // clips, gallery pieces, etc. site-wide.
      if (e.target.closest?.('img, video')) setVariant('invert')
    }
    const handleOut = (e) => {
      if (e.target.closest?.('[data-cursor-hover]') || e.target.closest?.('img, video')) setVariant('default')
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
  const isBadge = variant === 'expand'

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
          {label}
        </span>
      </motion.div>

      {/* Badge — expand hover (playground pieces). A plain circle + arrow,
          no text, so it stays legible packed tightly between pieces
          instead of a wide pill constantly overlapping its neighbors. */}
      <motion.div
        initial={false}
        animate={{ opacity: isBadge ? 1 : 0, scale: isBadge ? 1 : 0.8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          translate: '-50% -50%',
          width: BADGE_SIZE,
          height: BADGE_SIZE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: NAVY,
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)',
        }}
      >
        <ArrowUpRightIcon size={14} />
      </motion.div>
    </motion.div>
  )
}
