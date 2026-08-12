import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { PROJECTS } from './projects.js'

// 4 slots in the grid — real projects first, then generic "coming soon"
// placeholders padding out the rest. Swap this for PROJECTS directly once
// there are enough real case studies to fill the grid on its own.
const SLOT_COUNT = 4
const SLOTS = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const project = PROJECTS[i]
  return project
    ? { id: project.id, title: project.label.replace(/^\d+\s*\/\/\s*/, ''), description: project.description }
    : { id: `placeholder-${i}`, title: 'Coming Soon', description: null }
})

/**
 * Body content for the expanded WORK section. The "WORK" label +
 * "take me back" header is rendered generically by Shell.jsx.
 *
 * Placeholder grid — 2x2 of flat rectangles (real case-study titles where
 * PROJECTS has them, "Coming Soon" for the rest), standing in for where
 * the real case-study previews will go. Sharp corners, no shadow, same
 * flat treatment as every other image on the site.
 *
 * Sized to fill the panel's full given height (via Shell.jsx's flex: 1
 * wrapper) rather than being aspect-ratio-locked, so it always fits the
 * viewport with no scrolling.
 *
 * Clicking a box "opens" it — the grid is replaced by a single full-size
 * panel for that case study. No animated grow/morph on the box itself
 * (that read as "doing too much" — a grid cell resizing into a totally
 * different shape/position is a lot of simultaneous motion); the box is
 * just there at full size immediately. The only animation is the title/
 * description fading in a beat after — the "second half" of what used to
 * be a two-part transition, kept on its own. A small "← Back" link
 * returns to the grid.
 *
 * TODO: case studies go here — send the Figma frames for each project
 * and this gets built out to match, one real preview per box.
 */
export default function WorkContent() {
  const [openId, setOpenId] = useState(null)
  const openSlot = SLOTS.find((slot) => slot.id === openId) ?? null

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: `${rpx(24)} ${rpx(64)} ${rpx(64)}`,
      }}
    >
      <AnimatePresence>
        {openSlot ? (
          <motion.div key="expanded" style={{ flex: '1 1 auto', minHeight: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.25)' }} />

            <motion.button
              data-cursor-hover="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              onClick={() => setOpenId(null)}
              style={{
                position: 'absolute',
                top: rpx(24),
                left: rpx(24),
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(14),
                color: 'rgba(0, 0, 0, 0.55)',
              }}
            >
              ← Back
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              style={{ position: 'absolute', left: rpx(32), bottom: rpx(32), right: rpx(32) }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-serif)',
                  fontSize: rpx(40),
                  color: 'var(--color-text)',
                }}
              >
                {openSlot.title}
              </p>
              <p
                style={{
                  margin: `${rpx(8)} 0 0 0`,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(16),
                  color: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                {openSlot.description ?? 'Full case study coming soon.'}
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: rpx(24),
            }}
          >
            {SLOTS.map((slot) => (
              <div
                key={slot.id}
                data-cursor-hover="ring"
                onClick={() => setOpenId(slot.id)}
                style={{ position: 'relative', minWidth: 0, minHeight: 0, cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.25)' }} />
                <p
                  style={{
                    position: 'absolute',
                    left: rpx(16),
                    bottom: rpx(16),
                    margin: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: rpx(16),
                    color: 'var(--color-text)',
                  }}
                >
                  {slot.title}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
