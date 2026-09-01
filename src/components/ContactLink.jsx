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
          margin: `${rpx(-8)} ${rpx(-14)}`,
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: rpx(10) }}>
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
            margin: `${rpx(-8)} ${rpx(-14)}`,
            borderRadius: '999px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <span>Contact</span>
          <motion.span
            animate={{ y: hovered ? -3 : 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ display: 'inline-block', fontSize: rpx(19) }}
          >
            ↑
          </motion.span>
        </motion.span>
      </motion.div>
    </div>
  )
}
