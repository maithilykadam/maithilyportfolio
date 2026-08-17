import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { PROJECTS } from './projects.js'
import OpheliaCaseStudy from './OpheliaCaseStudy.jsx'

// Which projects (by id, from projects.js) actually fill the WORK grid,
// and in what order — lets a project stay defined in projects.js (with all
// its real content) without necessarily being one of the ones on display,
// and vice versa swap one in later with just a one-line change here. No
// longer capped at 4 the way the old fixed-height bento was — this list is
// meant to just keep growing as more real case studies get written up (see
// the scrolling note below).
const WORK_GRID_IDS = [
  'ophelia-ai-interface',
  'bitesize',
  'oakville-milton-humane-society',
  'serviceontario-integration',
  'orbit-mobile-design',
]
const SLOTS = WORK_GRID_IDS.map((id, i) => {
  const project = PROJECTS.find((p) => p.id === id)
  return project
    ? { id: project.id, title: project.label.replace(/^\d+\s*\/\/\s*/, ''), description: project.description }
    : { id: `placeholder-${i}`, title: 'Coming Soon', description: null }
})

// Same screen-recording previews as the home page boxes (see
// WorkHomeContent.jsx) — reused here by id rather than duplicated data, so
// swapping either video in one place keeps both spots in sync.
const VIDEO_BY_ID = {
  'ophelia-ai-interface': { src: '/home/ophelia/ophelia-demo-6.mp4', poster: '/home/ophelia/ophelia-demo-6-poster.jpg' },
  bitesize: { src: '/home/bitesize/bitesize-demo.mp4', poster: '/home/bitesize/bitesize-demo-poster.jpg' },
  'oakville-milton-humane-society': {
    src: '/home/humanesociety/humanesociety-demo.mp4',
    poster: '/home/humanesociety/humanesociety-demo-poster.jpg',
  },
}

function chunkIntoColumns(items, columns) {
  const cols = Array.from({ length: columns }, () => [])
  items.forEach((item, i) => cols[i % columns].push(item))
  return cols
}

// A two-column masonry list — each card a fixed-aspect image/video with a
// caption row underneath, instead of the old fixed-height bento grid. Sized
// to its own natural content height (not stretched/shrunk to fill the
// panel), so the list just keeps growing downward as more projects get
// added rather than needing to keep re-splitting a fixed pixel budget
// between however many boxes happen to exist — the panel scrolls instead
// (see the outer wrapper's `overflowY` below).
//
// Boxes sit at 94% of their column's width (scaled down from full-bleed
// per request) rather than stretching to fill it — the parent column sets
// `alignItems: center` so the leftover space splits evenly on both sides
// instead of collecting on one edge. aspectRatio keeps the box
// proportionally shorter too, so it's a true scale-down in both
// dimensions, not just narrower.
//
// Caption is a plain stacked title/one-liner (not the old two-column
// pull-quote/small-caps masthead layout) — the project name up top at
// normal weight, its description underneath in a smaller, lighter line.
function PreviewBox({ slot, onOpen }) {
  const video = VIDEO_BY_ID[slot.id]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(12), width: '94%' }}>
      <div
        data-cursor-hover="ring"
        onClick={() => onOpen(slot.id)}
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          cursor: 'pointer',
          overflow: 'hidden',
          background: video ? '#000' : 'rgba(0, 0, 0, 0.25)',
        }}
      >
        {video && (
          <video
            src={video.src}
            poster={video.poster}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(4) }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            fontSize: rpx(24),
            color: 'var(--color-text)',
          }}
        >
          {slot.title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: rpx(16),
            lineHeight: 1.4,
            color: 'rgba(0, 0, 0, 0.45)',
          }}
        >
          {slot.description ?? 'One-liner coming soon.'}
        </p>
      </div>
    </div>
  )
}

/**
 * Body content for the expanded WORK section. The "WORK" label +
 * "take me back" header is rendered generically by Shell.jsx.
 *
 * Grid — a two-column masonry of flat rectangles (real case-study titles
 * where PROJECTS has them, "Coming Soon" for the rest), standing in for
 * where the real case-study previews will go. Sharp corners, no shadow,
 * same flat treatment as every other image on the site.
 *
 * Sized to its own natural content height rather than squeezed to fit the
 * panel — the list is meant to keep growing as more case studies get
 * written, so the panel scrolls (see the outer wrapper's `overflowY`)
 * instead of everything shrinking to stay on one screen.
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
 * A case study is a real, distinct URL — /work/:projectId — not just
 * local component state layered on top of /work. `openId` is read
 * straight off the current path on every render rather than tracked in
 * useState, so there's nothing to keep in sync by hand: the WORK nav item,
 * the "← Back" controls, and the browser's own back/forward buttons all
 * just navigate to a URL, and whatever's actually on screen always matches
 * it exactly. (App.jsx still treats any /work/* path as the same "work"
 * section for the flip-panel transition — only this component cares about
 * the second path segment.) The home page's Ophelia box, for instance,
 * links straight to /work/ophelia-ai-interface (see Shell.jsx's
 * `goToProject`) so clicking it opens directly into that case study
 * instead of dropping onto the grid first.
 */
export default function WorkContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const openId = location.pathname.split('/')[2] ?? null
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
        padding: isOphelia ? 0 : `${rpx(24)} ${rpx(64)} ${rpx(120)}`,
        // The grid needs to scroll now that it's no longer squeezed to fit
        // one screen (more projects just keep adding rows below the fold).
        // Harmless for the case-study states too — both size themselves to
        // exactly this box's height with their own internal scrolling, so
        // there's never anything here for this outer scroll to actually
        // trigger on while one of those is open.
        overflowY: 'auto',
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
            <OpheliaCaseStudy onBack={() => navigate('/work')} />
          </motion.div>
        ) : openSlot ? (
          <motion.div key="expanded" style={{ flex: '1 1 auto', minHeight: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.25)' }} />

            <motion.button
              data-cursor-hover="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              onClick={() => navigate('/work')}
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
          <motion.div key="grid" style={{ flexShrink: 0 }}>
            {/* Small personal-voice tagline under the WORK label — just a
                friendly one-liner, not a real caption/instruction, so it's
                sized and styled well below the grid content itself (italic,
                muted, no serif pull-quote weight) rather than competing
                with it. */}
            <p
              style={{
                margin: `0 0 ${rpx(32)} 0`,
                fontFamily: 'var(--font-sans)',
                fontStyle: 'italic',
                fontSize: rpx(15),
                color: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              Case studies, side projects, a little bit of everything — enjoy!
            </p>
            {/* Two-column masonry — no longer squeezed into one fixed-height
                screen; the list just grows downward as more projects are
                added and the panel scrolls (see the outer wrapper's
                overflowY) instead of everything having to keep re-fitting a
                shrinking pixel budget. */}
            <div style={{ display: 'flex', gap: rpx(16), alignItems: 'flex-start' }}>
              {chunkIntoColumns(SLOTS, 2).map((column, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: rpx(48),
                    flex: '1 1 0',
                    minWidth: 0,
                  }}
                >
                  {column.map((slot) => (
                    <PreviewBox key={slot.id} slot={slot} onOpen={(id) => navigate(`/work/${id}`)} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
