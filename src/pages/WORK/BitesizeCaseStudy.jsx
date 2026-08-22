import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

// Same accent used across every other case study's active nav item and the
// custom cursor's case-study hover state, so it reads as the same site-wide
// system rather than a one-off.
const NAVY = '#1e3a8a'
const HAIRLINE = '1px solid rgba(0, 0, 0, 0.1)'
// A pale tint of Bitesize's own navy (the same blue as its "Done"/"Start
// task" buttons and task cards) — the mat behind the Problem section's
// screens, same idea as Ophelia's VIDEO_MAT tying a background color back
// to the actual brand instead of being arbitrary.
const SCREEN_MAT = 'rgba(30, 58, 138, 0.08)'

const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px 0px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

// Role/timeline/team left as `null` rather than invented — same
// "Add this" placeholder fallback as Ophelia's METADATA, honest about what
// isn't confirmed yet instead of guessing.
const METADATA = [
  { label: 'Role', value: 'UX/Product Designer' },
  { label: 'Platform', value: 'Mobile app' },
  { label: 'Timeline', value: null },
  { label: 'Team', value: null },
]

// Real screens from the actual add-a-task flow (public/home/bitesize/
// add-task-flow), in the order they'd happen. Captions describe what's
// on screen and why it's built that way, not just what it's called.
const ADD_TASK_FRAMES = [
  {
    src: '/home/bitesize/add-task-flow/01-home.png',
    label: 'Home',
    note: "Today's tasks stack up front like real note cards instead of a flat list, so the ones closest to top of mind are also closest to the top of the screen.",
  },
  {
    src: '/home/bitesize/add-task-flow/02-add-chooser.png',
    label: 'Add chooser',
    note: 'One + button, one choice: a quick note for something fast, or a task for something with steps of its own.',
  },
  {
    src: '/home/bitesize/add-task-flow/03-add-task-sheet.png',
    label: 'Add a task',
    note: "Recurring \"sets\" (Sunday reset, grocery reset) turn a routine you repeat every week into a single tap instead of retyping the same list.",
  },
  {
    src: '/home/bitesize/add-task-flow/04-add-task-typing.png',
    label: 'Building the checklist',
    note: 'Each item typed joins a running checklist right below the input, so the task takes shape in view instead of disappearing into a form field.',
  },
  {
    src: '/home/bitesize/add-task-flow/05-add-task-success.png',
    label: 'Saved',
    note: 'A quiet confirmation, then straight back to the list, the new task already folded in among the rest.',
  },
]

// Real screens from the quick-note flow (public/home/bitesize/
// quick-note-flow). Trimmed from the full capture set: two nearly
// identical "selecting" frames were combined into one representative step
// so the filmstrip reads as a sequence, not a scrub through every frame.
const QUICK_NOTE_FRAMES = [
  {
    src: '/home/bitesize/quick-note-flow/01-notes-grid.png',
    label: 'Quick notes',
    note: 'Quick notes live in their own space: small enough to jot "call mom" or "get sugar" without committing to a whole task.',
  },
  {
    src: '/home/bitesize/quick-note-flow/02-select-mode.png',
    label: 'Select',
    note: '"Select" turns the same grid into a picker, so bundling notes together doesn’t need a separate screen of its own.',
  },
  {
    src: '/home/bitesize/quick-note-flow/04-three-selected.png',
    label: 'Selected',
    note: 'Checking off a few notes at once surfaces one button: build them into a task together.',
  },
  {
    src: '/home/bitesize/quick-note-flow/05-build-task-sheet.png',
    label: 'Build your task',
    note: "The selected notes carry over as the task's first steps already filled in, with room to add more or give it a name.",
  },
  {
    src: '/home/bitesize/quick-note-flow/06-build-task-named.png',
    label: 'Naming it',
    note: '"Mother’s day errands" turns three scattered notes into one task with a reason behind it.',
  },
  {
    src: '/home/bitesize/quick-note-flow/07-task-built.png',
    label: 'Ready to go',
    note: 'Confirmation, then back to the notes list, now with those three cleared off it.',
  },
]

// Real screens from the start-a-task / focus-mode flow (public/home/
// bitesize/start-task-flow). Every ring state is kept in rather than
// trimmed, since the filling ring across all four steps is the point of
// this flow, not just its start and end.
const START_TASK_FRAMES = [
  {
    src: '/home/bitesize/start-task-flow/01-home.png',
    label: 'Home',
    note: "Tasks sit collapsed on the home screen until you're ready to actually start one.",
  },
  {
    src: '/home/bitesize/start-task-flow/02-task-expanded.png',
    label: 'Expanded in place',
    note: 'Tapping a card unfolds it right there into its checklist: steps can be renamed or added before committing to starting.',
  },
  {
    src: '/home/bitesize/start-task-flow/03-step-1of4.png',
    label: 'Step 1 of 4',
    note: '"Start task" hands off to a focus screen: one step at a time, with a ring that fills as you go instead of a flat progress bar.',
  },
  {
    src: '/home/bitesize/start-task-flow/04-step-2of4.png',
    label: 'Step 2 of 4',
    note: "Every screen previews what's next, so there's no wondering what's coming after this step.",
  },
  {
    src: '/home/bitesize/start-task-flow/05-step-3of4.png',
    label: 'Step 3 of 4',
    note: 'By the third step the ring is most of the way full, a small, steady signal of how close the task is to done.',
  },
  {
    src: '/home/bitesize/start-task-flow/06-step-4of4.png',
    label: 'Step 4 of 4',
    note: "The last step swaps \"Next step\" for \"Complete task,\" and the copy shifts to \"Last one!\"",
  },
  {
    src: '/home/bitesize/start-task-flow/07-step-4of4-done.png',
    label: 'All done',
    note: 'All four dots filled in, right before the task closes out.',
  },
  {
    src: '/home/bitesize/start-task-flow/08-complete.png',
    label: 'Complete',
    note: '"Nicely done!" confirms what got finished and drops back into focus mode instead of just closing the task.',
  },
]

// A short line of real design philosophy (the user's own words, condensed
// rather than invented) — same "one strong line beats a wall of text"
// treatment as Ophelia's manifesto quote.
const GUIDING_PRINCIPLE =
  'ADHD brains run on less dopamine, and shame doesn’t fix that. Bitesize is built to support every step, and if a task doesn’t get finished, that’s fine too. You can always come back to it.'

const SECTIONS = ['Overview', 'Problem', 'Process', 'Add a Task', 'Quick Notes', 'Start a Task', 'Reflection']

// Same connective-line pattern as Ophelia's Transition component: a short
// line above a section, so the page reads as one continuous story while
// scrolling instead of a stack of self-contained blocks.
function Transition({ children }) {
  return (
    <p
      style={{
        margin: `0 0 ${rpx(10)} 0`,
        maxWidth: rpx(820),
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: rpx(34),
        lineHeight: 1.25,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </p>
  )
}

// Same click-to-pause treatment as every video on Ophelia's page — a
// small corner button instead of the video just looping forever with no
// way to stop and look at a frame.
function PlayableVideo({ src, poster }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        onClick={toggle}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        style={{
          position: 'absolute',
          top: rpx(12),
          left: rpx(12),
          width: rpx(28),
          height: rpx(28),
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {playing ? (
          <span style={{ display: 'flex', gap: rpx(3) }}>
            <span style={{ width: rpx(3), height: rpx(11), background: 'white', borderRadius: rpx(1) }} />
            <span style={{ width: rpx(3), height: rpx(11), background: 'white', borderRadius: rpx(1) }} />
          </span>
        ) : (
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: `${rpx(6)} solid transparent`,
              borderBottom: `${rpx(6)} solid transparent`,
              borderLeft: `${rpx(9)} solid white`,
              marginLeft: rpx(2),
            }}
          />
        )}
      </button>
    </div>
  )
}

// Full-screen popout for any image on this page — every screenshot here is
// shown smaller than its native resolution (the filmstrips especially), so
// clicking one opens it large instead of leaving zooming in as the only
// option. Click the backdrop or the × to close.
function Lightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: rpx(56),
            cursor: 'zoom-out',
          }}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            src={image.src}
            alt={image.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: rpx(8),
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
              cursor: 'default',
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: rpx(24),
              right: rpx(28),
              width: rpx(36),
              height: rpx(36),
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: rpx(20),
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Any clickable screenshot on this page — a plain <img> gave no signal
// that clicking did anything, so this adds a dark hover tint plus a small
// magnifying-glass badge (same dark, blurred-circle treatment as
// PlayableVideo's corner button) that fades in on hover, then opens the
// Lightbox on click.
function ClickableImage({ src, alt, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ position: 'relative', cursor: 'zoom-in' }}
    >
      <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0)',
          transition: 'background 0.15s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            width: rpx(34),
            height: rpx(34),
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={rpx(16)} height={rpx(16)} viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// A horizontally scrollable row of real screens — same pattern as
// Ophelia's Onboarding walkthrough: each phone screenshot shown full size
// instead of shrunk to fit a grid, with a numbered label and a line of
// rationale underneath, and a fade over the row's right edge signaling
// there's more to scroll to.
function Filmstrip({ frames, onImageClick }) {
  return (
    <>
      <p
        style={{
          margin: `${rpx(12)} 0 0 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(12),
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        Scroll to see all {frames.length} →
      </p>
      <div style={{ marginTop: rpx(20), position: 'relative' }}>
        <div style={{ display: 'flex', gap: rpx(20), overflowX: 'auto', paddingBottom: rpx(12) }}>
          {frames.map((frame, i) => (
            <div key={frame.label} style={{ display: 'flex', flexDirection: 'column', gap: rpx(8), width: rpx(260), flexShrink: 0 }}>
              <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                <ClickableImage src={frame.src} alt={frame.label} onClick={() => onImageClick?.({ src: frame.src, alt: frame.label })} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(12),
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
              >
                {i + 1}. {frame.label}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(15), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                {frame.note}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: rpx(12),
            width: rpx(60),
            background: 'linear-gradient(to right, rgba(235, 241, 246, 0), rgba(235, 241, 246, 1))',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  )
}

export default function BitesizeCaseStudy({ onBack }) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [backHovered, setBackHovered] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { root, rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Sidebar — same fixed, scroll-spy pattern as Ophelia's, with the
          same bottom-padding clearance for the site-wide fixed Resume
          pill (see ResumeLink.jsx). */}
      <div
        style={{
          width: rpx(260),
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          padding: `${rpx(32)} ${rpx(32)} ${rpx(160)} ${rpx(24)}`,
          borderRight: HAIRLINE,
        }}
      >
        <motion.button
          data-cursor-hover="button"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backgroundColor: backHovered ? 'rgba(30, 58, 138, 0.08)' : 'rgba(30, 58, 138, 0)',
            transition: { opacity: { delay: 0.15, duration: 0.3 }, backgroundColor: { duration: 0.2 } },
          }}
          onClick={onBack}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: `${rpx(6)} ${rpx(12)}`,
            margin: `${rpx(-6)} ${rpx(-12)}`,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(16),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          ← Back
        </motion.button>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
          style={{ marginTop: rpx(28), display: 'flex', flexDirection: 'column', gap: rpx(14) }}
        >
          {SECTIONS.map((section, i) => {
            const active = i === activeIndex
            return (
              <button
                key={section}
                data-cursor-hover="button"
                onClick={() => scrollToSection(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(15),
                  lineHeight: 1.4,
                  fontWeight: active ? 600 : 400,
                  color: active ? NAVY : 'rgba(0, 0, 0, 0.5)',
                  transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                }}
              >
                {section}
              </button>
            )
          })}
        </motion.nav>
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.35 } }}
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          height: '100%',
          overflowY: 'auto',
          padding: `${rpx(32)} ${rpx(64)} ${rpx(96)} ${rpx(72)}`,
        }}
      >
        <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(52), color: 'var(--color-text)' }}>
          Bitesize
        </h1>
        <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.5)' }}>
          A mobile task app for breaking big to-dos into small, doable steps
        </p>

        {/* Hero video — the existing product demo clip. */}
        <div style={{ marginTop: rpx(28), width: '100%', maxWidth: rpx(760), border: '1px solid rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
          <PlayableVideo src="/home/bitesize/bitesize-demo.mp4" poster="/home/bitesize/bitesize-demo-poster.jpg" />
        </div>

        {/* Metadata strip */}
        <div
          style={{
            marginTop: rpx(28),
            display: 'flex',
            gap: rpx(48),
            padding: `${rpx(18)} 0`,
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
          }}
        >
          {METADATA.map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(11), letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                {label}
              </p>
              <p
                style={{
                  margin: `${rpx(4)} 0 0 0`,
                  fontFamily: 'var(--font-sans)',
                  fontStyle: value ? 'normal' : 'italic',
                  fontSize: rpx(15),
                  color: value ? 'var(--color-text)' : 'rgba(0, 0, 0, 0.4)',
                }}
              >
                {value ?? 'Add this'}
              </p>
            </div>
          ))}
        </div>

        {/* Overview */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
          style={{ marginTop: rpx(56) }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: rpx(13), letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.45)' }}>
            Overview
          </p>
          <p style={{ margin: `${rpx(14)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(42), lineHeight: 1.2, color: 'var(--color-text)' }}>
            Big tasks stall before they start. Bitesize breaks them into steps small enough to actually begin.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.55)' }}>
            Three flows carry the app: capturing a quick note, building a real task (either from scratch or from
            a few bundled notes), and working through one step at a time in a focused, distraction-free screen.
          </p>
        </motion.section>

        {/* Problem — the real, personal reason this app exists, kept to a
            couple short lines plus a real screen instead of a wall of
            text, so the "why" reads in the same few seconds as the
            screens themselves. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which came from a real, personal problem before it was ever a product one.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            As someone with ADHD, I could never find an app that actually worked the way my brain does. The
            real barrier was never remembering a task, it was starting one: something that feels too big just
            doesn't get started, then it gets left.
          </p>
          {/* Three real screens, not a stock illustration — the actual
              path from "a stack of tasks" to "one small step," sitting on
              a mat of Bitesize's own navy so it reads as a deliberate
              trio rather than a single oversized screenshot. */}
          <div style={{ marginTop: rpx(28), maxWidth: rpx(820), background: SCREEN_MAT, padding: rpx(28), borderRadius: rpx(12) }}>
            <div style={{ display: 'flex', gap: rpx(20) }}>
              {[
                { src: '/home/bitesize/add-task-flow/01-home.png', alt: 'Bitesize home screen with a stack of tasks' },
                { src: '/home/bitesize/start-task-flow/02-task-expanded.png', alt: 'A task unfolded into its checklist' },
                { src: '/home/bitesize/start-task-flow/03-step-1of4.png', alt: 'Focus mode showing one step at a time' },
              ].map((shot) => (
                <div key={shot.src} style={{ flex: '1 1 0', border: HAIRLINE, borderRadius: rpx(8), overflow: 'hidden', background: '#fff' }}>
                  <ClickableImage src={shot.src} alt={shot.alt} onClick={() => setLightbox(shot)} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: rpx(24), maxWidth: rpx(680), paddingLeft: rpx(24), borderLeft: `3px solid ${NAVY}` }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: rpx(18), lineHeight: 1.5, color: 'var(--color-text)' }}>
              {GUIDING_PRINCIPLE}
            </p>
          </div>
        </motion.section>

        {/* Process — real early sketches (with the actual sticky-note
            feedback still on them) alongside the board that organized them
            into the three flows this case study actually walks through.
            Both images shown side by side and smaller rather than each
            blown up full width, since together they're one "before and
            after" beat, not two separate visual moments. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which started on paper, sketching through a few different versions before any of it was real.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Early sketches worked through where notes and tasks should live and how adding something new
            should feel. Two decisions changed direction entirely: adding a task became a popup instead of
            its own page, and "select a bunch of quick wins to create a big task" turned into the whole
            Quick Notes flow. From there, the scattered sketches got organized into three flows: a create
            flow, a collect-quick-wins flow, and a set of task types. A pill-shaped nav bar and a branded
            loading screen got sketched too, but didn't make it past this stage.
          </p>
          <div style={{ marginTop: rpx(24), maxWidth: rpx(820), display: 'flex', gap: rpx(20) }}>
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: rpx(8) }}>
              <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                <ClickableImage
                  src="/home/bitesize/process/research-sketches.png"
                  alt="Hand-drawn sketches of the home, notes, and add-task screens with feedback notes"
                  onClick={() =>
                    setLightbox({
                      src: '/home/bitesize/process/research-sketches.png',
                      alt: 'Hand-drawn sketches of the home, notes, and add-task screens with feedback notes',
                    })
                  }
                />
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), color: 'rgba(0, 0, 0, 0.5)' }}>
                Early sketches, with notes on what needed to change.
              </p>
            </div>
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: rpx(8) }}>
              <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                <ClickableImage
                  src="/home/bitesize/process/functionalities-board.png"
                  alt="A board organizing sketched ideas into a create flow, a collect-quick-wins flow, and task types"
                  onClick={() =>
                    setLightbox({
                      src: '/home/bitesize/process/functionalities-board.png',
                      alt: 'A board organizing sketched ideas into a create flow, a collect-quick-wins flow, and task types',
                    })
                  }
                />
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), color: 'rgba(0, 0, 0, 0.5)' }}>
                Organized into the three flows this case study walks through.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Add a Task */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Starting with the most direct path: typing out a task from nothing.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            One sheet handles both a fresh checklist and a recurring routine, so adding a task never means
            leaving the home screen.
          </p>
          <Filmstrip frames={ADD_TASK_FRAMES} onImageClick={setLightbox} />
        </motion.section>

        {/* Quick Notes */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[4] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Not everything worth writing down is a whole task, though.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            Quick notes capture the small stuff fast, and can bundle together into a real task later, once
            enough of them add up to one.
          </p>
          <Filmstrip frames={QUICK_NOTE_FRAMES} onImageClick={setLightbox} />
        </motion.section>

        {/* Start a Task */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[5] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>And once a task exists, actually working through it is its own moment.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            Starting a task hands off from the list to a single-step focus screen, one thing on screen at a
            time until the whole task is done.
          </p>
          <Filmstrip frames={START_TASK_FRAMES} onImageClick={setLightbox} />
        </motion.section>

        {/* Reflection */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[6] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which is what these three flows have in common: getting from an idea to something started.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Capturing a task and starting one turned out to be two very different moments. Adding a task
            rewards speed: recurring sets, a running checklist that builds as you type. Starting one rewards
            focus instead: one step, one screen, nothing else competing for attention.
          </p>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Quick notes exist for everything in between: too small to be a task on their own, too easy to
            forget if they go unwritten. Letting a few of them bundle into a real task, rather than building
            a separate "promote to task" flow, kept the app to one core object instead of two.
          </p>
        </motion.section>
      </motion.div>

      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
