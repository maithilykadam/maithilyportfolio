import { useState } from 'react'
import { motion } from 'framer-motion'
import { rpx, rvh } from '../constants/responsive.js'

/**
 * Resume link — fixed to the bottom-left corner of the viewport across
 * every panel (home, work, who, playground), rendered once at the Shell
 * level rather than living inside the home page only. Same hover treatment
 * as before: a soft pill background fades in and the arrow nudges up-right.
 *
 * Same adaptive fill as the bottom nav (see BottomStepper.jsx), now on
 * every panel including HOME — the pill picks up a resting backgroundColor
 * of the page's own background, legible over whatever's running
 * underneath it. Hovering still shows the blue tint regardless of panel,
 * same as before; the needsFill background only shows up when NOT
 * hovered, so the hover state always reads the same everywhere.
 *
 * Points at the real resume PDF (public/Resume.pdf — served from the site
 * root as /Resume.pdf), opened in a new tab so clicking it never navigates
 * away from the site itself.
 */
export default function ResumeLink({ active }) {
  const [hovered, setHovered] = useState(false)
  const needsFill = active === 'home' || active === 'who' || active === 'work' || active === 'play'

  return (
    <motion.a
      href="/Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: rpx(64),
        // rvh (viewport-height-based), not rpx — see the note in
        // HeroContent.jsx on the roles list this sits directly below on
        // the home panel; both need to compress together on a short
        // window or the roles list runs into this.
        bottom: rvh(64),
        display: 'inline-flex',
        alignItems: 'center',
        gap: rpx(6),
        fontFamily: 'var(--font-sans)',
        fontSize: rpx(19),
        color: 'var(--color-text)',
        cursor: 'pointer',
        zIndex: 10,
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
        }}
      >
        <span>Resume</span>
        <motion.span
          animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ display: 'inline-block', fontSize: rpx(19) }}
        >
          ↗
        </motion.span>
      </motion.span>
    </motion.a>
  )
}
