import { useState } from 'react'
import { motion } from 'framer-motion'
import { PLAYGROUND_RAIL_WIDTH } from '../constants/layout.js'
import { rpx } from '../constants/responsive.js'

/**
 * The collapsed "PLAYGROUND" rail — a thin strip flush against the right
 * edge of the home panel only (brought back from the old magazine-style
 * layout, where PLAYGROUND was its own column). It doesn't preview any
 * content; it's just a label you click to slide over to the full
 * Playground panel — same `jumpTo('play')` the bottom nav pill uses.
 *
 * Deliberately not hover-to-expand: a click-only affordance so a stray
 * mouse pass over the right edge doesn't yank the page over to another
 * panel.
 *
 * Restyled to match the editorial system everywhere else (ExpandedHeader's
 * section labels, BottomStepper's nav words): serif type, no background
 * fill on hover, just a darken. The original bold tracked-out sans-serif
 * label with a colored hover tint read as an app sidebar tab, which was
 * the one place on the page still fighting the newspaper look.
 *
 * First pass at the resting (non-hovered) color matched BottomStepper's
 * inactive words (0.4 opacity), but those sit in a row of four peers where
 * being the quietest one is fine — this is the ONLY thing on that edge of
 * the screen, so it needs to actually read as "there's a label here" at a
 * glance. Resting opacity bumped up to match ExpandedHeader's other
 * section labels (0.7) instead, with a slightly bigger size and a touch
 * more letter-spacing so it holds its own as a vertical strip.
 */
export default function PlaygroundRail({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      data-cursor-hover="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: rpx(PLAYGROUND_RAIL_WIDTH),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.025)',
        border: 'none',
        borderLeft: '1px solid rgba(0, 0, 0, 0.18)',
        cursor: 'pointer',
        zIndex: 5,
      }}
    >
      <motion.span
        animate={{
          y: hovered ? -6 : 0,
          opacity: hovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          display: 'inline-block',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: 'var(--font-serif)',
          fontSize: rpx(21),
          letterSpacing: '0.12em',
          color: 'var(--color-text)',
        }}
      >
        PLAYGROUND
      </motion.span>
    </motion.button>
  )
}
