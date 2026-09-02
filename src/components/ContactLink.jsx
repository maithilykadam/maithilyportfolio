import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx, rvh } from '../constants/responsive.js'

// Exported so MobileBottomBar.jsx can reuse the same real data for its own
// tap-to-reveal contact list instead of duplicating it.
export const CONTACT_OPTIONS = [
  { label: 'Email', href: 'mailto:maithily.kadam@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/maithilykadam/', external: true },
]

// One row in the hover-revealed option list — same size and same adaptive
// pill background as the main Contact label below (not just plain text),
// so each option is actually legible sitting over a photo or video instead
// of relying on the parent's hover state alone to make the whole area
// readable.
//
// No negative margin canceling the padding here (unlike the single Contact
// pill below, where that trick keeps a lone element's resting position from
// shifting). These rows only exist in the DOM while the menu is open, so
// there's no resting-layout position to preserve — and canceling the
// padding was exactly what made Email's and LinkedIn's pills overlap: the
// padding stopped counting toward each row's height, so the flex column's
// `gap` was measuring space between two much-smaller invisible boxes while
// the actual painted pills (padding included) bled past them and into each
// other. Letting the padding count as real height means the pills are
// simply, reliably stacked with real space between them.
function ContactOption({ label, href, external, needsFill }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-cursor-hover="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        fontFamily: 'var(--font-sans)',
        fontSize: rpx(19),
        color: 'var(--color-text)',
      }}
    >
      <motion.span
        animate={{
          scale: hovered ? 1.12 : 1,
          backgroundColor: hovered
            ? 'rgba(30, 58, 138, 0.1)'
            : needsFill
              ? 'var(--color-bg)'
              : 'rgba(30, 58, 138, 0)',
          boxShadow: needsFill && !hovered ? '0 1px 8px rgba(0, 0, 0, 0.08)' : '0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          display: 'inline-block',
          padding: `${rpx(8)} ${rpx(14)}`,
          borderRadius: '999px',
        }}
      >
        {label}
      </motion.span>
    </motion.a>
  )
}

/**
 * Contact link — fixed to the bottom-right corner across every panel,
 * mirroring ResumeLink.jsx on the bottom-left. Same resting/hover pill
 * treatment (adaptive background fill, scale-up on hover) so the two read
 * as a matched pair of persistent corner links rather than one-off
 * elements. "Contact" itself isn't a link — hovering it reveals Email and
 * LinkedIn as two small stacked options above it (this sits at the very
 * bottom of the viewport, so the reveal opens upward, same direction
 * there's actually room in).
 */
export default function ContactLink({ active }) {
  const [hovered, setHovered] = useState(false)
  const needsFill = active === 'home' || active === 'who' || active === 'work' || active === 'play'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        right: rpx(64),
        // rvh, not rpx — same reasoning as ResumeLink's bottom offset: this
        // needs to compress together with vertical content above it on a
        // short window, not just scale with width.
        bottom: rvh(64),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: rpx(10),
        zIndex: 10,
      }}
    >
      <AnimatePresence>
        {hovered && (
          // No extra gap between rows — each pill's own padding (see the
          // comment on ContactOption above) already gives Email and
          // LinkedIn rpx(16) of combined breathing room, which reads as
          // plenty on its own without a visible seam between the two.
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {CONTACT_OPTIONS.map((option) => (
              <ContactOption key={option.label} {...option} needsFill={needsFill} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        data-cursor-hover="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: rpx(6),
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(19),
          color: 'var(--color-text)',
          cursor: 'pointer',
        }}
      >
        <motion.span
          animate={{
            scale: hovered ? 1.12 : 1,
            backgroundColor: hovered
              ? 'rgba(30, 58, 138, 0.1)'
              : needsFill
                ? 'var(--color-bg)'
                : 'rgba(30, 58, 138, 0)',
            boxShadow: needsFill && !hovered ? '0 1px 8px rgba(0, 0, 0, 0.08)' : '0 0 0 rgba(0, 0, 0, 0)',
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: rpx(6),
            padding: `${rpx(8)} ${rpx(14)}`,
            // Vertical-only canceling margin now — the horizontal half
            // used to cancel the left/right padding too, which let this
            // pill's real (padded) width bleed past its own flex-item box
            // on the right. Since Email/LinkedIn's pills (no canceling
            // margin at all — see ContactOption above) align their real
            // full width to the container's right edge, that bleed put
            // Contact's pill rpx(14) further right than both of them.
            // Letting the horizontal padding count for real here fixes
            // that: all three now align flush on the same right edge.
            margin: `${rpx(-8)} 0`,
            borderRadius: '999px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <span>Contact</span>
          {/* Static now — no y translate, no scale. The pill itself
              already scales up on hover (see the parent motion.span
              above), which was enough movement on its own; animating the
              arrow too on top of that just looked busy. */}
          <span style={{ display: 'inline-block', fontSize: rpx(19) }}>↑</span>
        </motion.span>
      </motion.div>
    </div>
  )
}
