import { useState } from 'react'
import { motion } from 'framer-motion'
import { rpx } from '../constants/responsive.js'

// Uppercase, matching how the section labels already read everywhere else
// on the site (ExpandedHeader's "WHO" / "WORK" / "PLAYGROUND") rather than
// the lowercase the earlier dot version used.
const LABEL = { home: 'HOME', work: 'WORK', who: 'WHO', play: 'PLAYGROUND' }

// A thin vertical rule between two words — the print-masthead way of
// separating section names (e.g. "NEWS | POLITICS | ARTS"), instead of a
// bullet or dot.
function Divider() {
  return <span style={{ width: '1px', height: rpx(12), background: 'rgba(0, 0, 0, 0.2)' }} />
}

// One word in the row. No pill, no fill, no blur — just serif type that
// darkens and gets a thin underline (a rubric line, like a printed section
// flag) when it's the active one; hover just darkens toward that same
// resting state so clicking around doesn't feel like pressing a button.
function NavWord({ section, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      data-cursor-hover="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        padding: `${rpx(4)} ${rpx(2)}`,
        cursor: 'pointer',
        fontFamily: 'var(--font-serif)',
        fontSize: rpx(14),
        letterSpacing: '0.08em',
      }}
    >
      <motion.span
        animate={{
          color: isActive ? 'var(--color-text)' : hovered ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.55)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {LABEL[section] ?? section}
      </motion.span>
      <motion.span
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '1px',
          background: 'var(--color-text)',
          transformOrigin: 'center',
        }}
      />
    </motion.button>
  )
}

/**
 * The nav pill's replacement, take two — the dot-based version worked but
 * read as a "modern app" component (rounded glass pill, filled dots),
 * which fought the newspaper/editorial direction the rest of the site is
 * going for. This drops the pill entirely: just serif section names
 * separated by thin masthead-style rules, sitting directly on the page
 * (no background, no blur), with a thin rule above it like a printed
 * section flag. The active section is picked out with a rubric underline
 * instead of a filled highlight. Still a direct jump — click any word and
 * it goes straight there via `onSelect` (Shell's `jumpTo`), no stepping
 * through the panels in between.
 *
 * The blur-only version (imperceptible over a flat background) turned out
 * too subtle to actually read over a busy photo grid — so this now goes
 * solid on every panel. HOME joined the list once its WORK placeholder
 * boxes were pulled bigger/closer to center — they now sit close enough
 * to where the nav floats that leaving it bare risked the same
 * legibility problem the others had. The fill uses the page's own
 * background color (not white/grey) so it reads as "the page itself
 * thickening up a bit," not a floating app chip dropped on top.
 *
 * Even filled, the pill was still getting lost against busy imagery (a
 * dark magazine cover, a photo) — tight padding and a barely-there shadow
 * meant it barely registered as a shape. Padding, shadow strength, and
 * the resting (non-active, non-hovered) text color are all bumped up so
 * it reads clearly at a glance instead of needing to be looked for.
 */
export default function BottomStepper({ active, sections, onSelect }) {
  const needsFill = active === 'home' || active === 'who' || active === 'work' || active === 'play'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        bottom: rpx(20),
        left: '50%',
        x: '-50%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: rpx(10),
      }}
    >
      <div style={{ width: rpx(220), height: '1px', background: 'rgba(0, 0, 0, 0.15)' }} />
      <motion.div
        animate={{
          backgroundColor: needsFill ? 'var(--color-bg)' : 'rgba(235, 241, 246, 0)',
          boxShadow: needsFill ? '0 2px 16px rgba(0, 0, 0, 0.14)' : '0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: rpx(18),
          padding: `${rpx(10)} ${rpx(22)}`,
          borderRadius: rpx(6),
        }}
      >
        {sections.map((section, i) => (
          <div key={section} style={{ display: 'flex', alignItems: 'center', gap: rpx(18) }}>
            {i > 0 && <Divider />}
            <NavWord section={section} isActive={active === section} onClick={() => onSelect(section)} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
