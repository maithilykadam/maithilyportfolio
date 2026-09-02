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
 * of the page's own background, legible over whatever's running underneath
 * it. Hover state now matches ContactLink.jsx's pill exactly (same navy
 * tint, same 1.12 scale on the whole pill as one unit — text and arrow
 * move together because they're inside it, neither animates on its own);
 * the needsFill background only shows up when NOT hovered, so the hover
 * state always reads the same everywhere.
 *
 * Points at the resume hosted on Google Drive, opened in a new tab so
 * clicking it never navigates away from the site itself.
 */
// Exported so MobileBottomBar.jsx can point at the exact same file instead
// of a second hardcoded copy of the URL.
export const RESUME_URL = 'https://drive.google.com/file/d/1WDQq9Bt5YbEDWYSLgHVQSJ4SWth1O2bI/view?usp=sharing'

export default function ResumeLink({ active }) {
  const [hovered, setHovered] = useState(false)
  const needsFill = active === 'home' || active === 'who' || active === 'work' || active === 'play'

  return (
    <motion.a
      href={RESUME_URL}
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
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Neither "Resume" nor the arrow animate individually — the pill
            around them (above) scales and tints as one unit on hover,
            same treatment as the Contact pill. */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: rpx(6) }}>
          <span>Resume</span>
          {/* Custom arrow instead of the ↗ glyph — short, thin stem with a
              chunkier, larger arrowhead corner (two thicker strokes) rather
              than the default character's thin, overlong tail. */}
          <svg width={rpx(19)} height={rpx(19)} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 14L13.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path
              d="M8 6H14V12"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </motion.span>
    </motion.a>
  )
}
