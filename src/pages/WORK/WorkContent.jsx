import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { PROJECTS } from './projects.js'
import OpheliaCaseStudy from './OpheliaCaseStudy.jsx'

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
 *
 * Landing directly on a specific case study (rather than the grid) is
 * supported via router state — e.g. the home page's Ophelia box navigates
 * with `{ state: { openId: 'ophelia-ai-interface' } }` instead of a plain
 * link to /work, so clicking it opens straight into that case study
 * instead of dropping you on the grid first. Read once at mount via
 * lazy useState init (not a useEffect) since Shell.jsx fully
 * unmounts/remounts this component on every navigation into the WORK
 * panel — a fresh mount is guaranteed on every visit, plain nav or not.
 */
export default function WorkContent() {
  const location = useLocation()
  const [openId, setOpenId] = useState(() => location.state?.openId ?? null)

  // Belt-and-suspenders on top of the lazy useState init above: if this
  // instance ever receives a new `openId` via router state without a full
  // remount (e.g. Shell.jsx's key={active} guarantee changing later, or an
  // in-flight AnimatePresence exit briefly reusing the outgoing instance),
  // sync to it explicitly rather than silently ignoring it and falling
  // back to the grid.
  useEffect(() => {
    if (location.state?.openId) setOpenId(location.state.openId)
  }, [location.state])

  const openSlot = SLOTS.find((slot) => slot.id === openId) ?? null
  // Ophelia gets a real, full-bleed case study page (sidebar + scrolling
  // content) instead of the generic darkened-overlay placeholder — so it
  // skips this container's own padding (its sidebar/content each manage
  // their own) and is handled as its own branch below.
  const isOphelia = openSlot?.id === 'ophelia-ai-interface'

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: isOphelia ? 0 : `${rpx(24)} ${rpx(64)} ${rpx(64)}`,
      }}
    >
      <AnimatePresence>
        {isOphelia ? (
          <motion.div
            key="ophelia"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            <OpheliaCaseStudy onBack={() => setOpenId(null)} />
          </motion.div>
        ) : openSlot ? (
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
