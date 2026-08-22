import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { PROJECTS } from './projects.js'
import OpheliaCaseStudy from './OpheliaCaseStudy.jsx'
import BitesizeCaseStudy from './BitesizeCaseStudy.jsx'
import PlaceholderCaseStudy from './PlaceholderCaseStudy.jsx'

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
// Real projects that don't have a written-up case study yet — their boxes
// stay in the grid (so the layout doesn't shift once they're ready) but
// read as inactive and not clickable (see `comingSoon` on PreviewBox
// below). Each gets its own small playful line instead of a flat "coming
// soon" repeated twice — Orbit gets a space pun off its own name, a nice
// bit of "in on the joke" personality rather than a generic placeholder.
const COMING_SOON_LINES = {
  'serviceontario-integration': 'Still cutting through the red tape ✂️',
  'orbit-mobile-design': 'Still in orbit — hasn’t landed yet 🚀',
}

const SLOTS = WORK_GRID_IDS.map((id, i) => {
  const project = PROJECTS.find((p) => p.id === id)
  return project
    ? {
        id: project.id,
        title: project.label.replace(/^\d+\s*\/\/\s*/, ''),
        description: project.description,
        // Each project's own accent color (see projects.js) doubles as
        // the comingSoon fill — keeps the box feeling like "this project,
        // not ready yet" rather than a generic gray placeholder.
        previewColor: project.previewColor,
        comingSoonLine: COMING_SOON_LINES[project.id],
        comingSoon: Boolean(COMING_SOON_LINES[project.id]),
      }
    : { id: `placeholder-${i}`, title: 'Coming Soon', description: null, comingSoon: true }
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

// Data-driven case studies (see PlaceholderCaseStudy.jsx) for projects
// that don't have a bespoke page like Ophelia's yet — same sidebar/title/
// Overview structure, just filled in with each project's own video and
// text instead of a one-off component per project. No `screens` yet for
// either — real wireframes get dropped into each project's public folder
// later, at which point a `screens` array here is all that's needed to
// make the Solution grid appear (see that file's doc comment).
const CASE_STUDY_DATA = {
  'oakville-milton-humane-society': {
    title: 'Oakville & Milton Humane Society',
    tagline: 'Redesigning the digital adoption experience',
    video: VIDEO_BY_ID['oakville-milton-humane-society'],
    overviewText:
      "A redesign of Oakville & Milton Humane Society's digital adoption experience — from browsing and filtering adoptable pets to the admin tools staff use to manage tasks, interaction logs, and user profiles behind the scenes. Wireframes and the full write-up will be added here shortly.",
  },
}

function chunkIntoColumns(items, columns) {
  const cols = Array.from({ length: columns }, () => [])
  items.forEach((item, i) => cols[i % columns].push(item))
  return cols
}

// Split once at module level (rather than inline in the render) since both
// halves of the left/right layout below need to reach into it separately.
const [LEFT_COLUMN, RIGHT_COLUMN] = chunkIntoColumns(SLOTS, 2)

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
//
// `comingSoon` boxes are deliberately inert — no onClick, no pointer
// cursor, no case-study cursor ring — but styled to feel like a cute
// placeholder rather than a dead gray box: the project's own accent color
// (see projects.js) as the fill, a bigger serif "Coming Soon" (matches the
// site's other personal-voice headings), and a small playful line
// underneath instead of just repeating "coming soon" a second time.
function PreviewBox({ slot, onOpen }) {
  const video = VIDEO_BY_ID[slot.id]
  const disabled = slot.comingSoon
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(12), width: '94%' }}>
      <div
        data-cursor-hover={disabled ? undefined : 'ring'}
        onClick={disabled ? undefined : () => onOpen(slot.id)}
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          cursor: disabled ? 'default' : 'pointer',
          overflow: 'hidden',
          background: video ? '#000' : disabled ? slot.previewColor ?? '#e8e2d8' : 'rgba(0, 0, 0, 0.25)',
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
        {disabled && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: rpx(10),
              padding: `0 ${rpx(32)}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: rpx(30),
                color: 'rgba(0, 0, 0, 0.55)',
              }}
            >
              Coming Soon
            </p>
            {slot.comingSoonLine && (
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(17),
                  color: 'rgba(0, 0, 0, 0.45)',
                }}
              >
                {slot.comingSoonLine}
              </p>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(4), opacity: disabled ? 0.5 : 1 }}>
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
  // Bitesize also gets its own bespoke case-study page now (see
  // BitesizeCaseStudy.jsx) instead of the generic data-driven placeholder,
  // same reasoning as Ophelia above.
  const isBitesize = openSlot?.id === 'bitesize'
  // Same full-bleed treatment for any other project with a real (if still
  // partly placeholder) case-study page — see CASE_STUDY_DATA above.
  const placeholderCaseStudy = openSlot ? CASE_STUDY_DATA[openSlot.id] : null
  const isFullCaseStudy = isOphelia || isBitesize || Boolean(placeholderCaseStudy)

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: isFullCaseStudy ? 0 : `${rpx(24)} ${rpx(64)} ${rpx(120)}`,
        // The grid needs to scroll now that it's no longer squeezed to fit
        // one screen (more projects just keep adding rows below the fold).
        // Harmless for the case-study states too — both size themselves to
        // exactly this box's height with their own internal scrolling, so
        // there's never anything here for this outer scroll to actually
        // trigger on while one of those is open.
        overflowY: 'auto',
      }}
    >
      {/* mode="wait" — without it, AnimatePresence's default "sync" mode
          keeps the exiting view (e.g. the full-bleed Ophelia case study)
          mounted and overlapping on screen with the entering one (the
          grid) for the length of the exit transition. During that overlap
          window a click can land on the still-present old view instead of
          the new one underneath it — e.g. landing back on Ophelia's own
          content when you meant to click a grid box that happens to sit
          where Ophelia's video/sidebar still was. Waiting for the exit to
          finish before mounting the next view removes that overlap
          entirely. */}
      <AnimatePresence mode="wait">
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
        ) : isBitesize ? (
          <motion.div
            key="bitesize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            <BitesizeCaseStudy onBack={() => navigate('/work')} />
          </motion.div>
        ) : placeholderCaseStudy ? (
          <motion.div
            key={openSlot.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            <PlaceholderCaseStudy {...placeholderCaseStudy} onBack={() => navigate('/work')} />
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
            {/* Same left/right split as the Playground gallery (see
                PlayContent.jsx): the tagline only takes up the left half,
                so the left column sits under it while the right column
                (nothing above it) starts level with the tagline's own top
                instead of waiting to clear its height first — same bento
                effect, same font/size/weight/color as Playground's blurb. */}
            <div style={{ display: 'flex', gap: rpx(16), alignItems: 'flex-start' }}>
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <p
                  style={{
                    margin: `0 0 ${rpx(24)} 0`,
                    fontFamily: 'var(--font-sans)',
                    fontSize: rpx(24),
                    lineHeight: 1.4,
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Case Studies, Side Projects, a little bit of everything, enjoy!
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0, ease: [0.16, 1, 0.3, 1] } }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: rpx(48), minWidth: 0 }}
                >
                  {LEFT_COLUMN.map((slot) => (
                    <PreviewBox key={slot.id} slot={slot} onOpen={(id) => navigate(`/work/${id}`)} />
                  ))}
                </motion.div>
              </div>

              <div style={{ width: '50%', display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] } }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: rpx(48),
                    flex: '1 1 0',
                    minWidth: 0,
                  }}
                >
                  {RIGHT_COLUMN.map((slot) => (
                    <PreviewBox key={slot.id} slot={slot} onOpen={(id) => navigate(`/work/${id}`)} />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
