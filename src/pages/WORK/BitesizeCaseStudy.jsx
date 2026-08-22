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
  { label: 'Role', value: 'UX Designer' },
  { label: 'Platform', value: 'Mobile app' },
  { label: 'Timeline', value: '2 weeks' },
  { label: 'Team', value: 'Two designers' },
]

// Real screens from the actual add-a-task flow (public/home/bitesize/
// add-task-flow), in the order they'd happen. Captions describe what's
// on screen and why it's built that way, not just what it's called.
const ADD_TASK_FRAMES = [
  {
    src: '/home/bitesize/add-task-flow/01-home.png',
    label: 'Home',
    note: "Today's tasks stack up front like real note cards, closest to mind, closest to the top.",
  },
  {
    src: '/home/bitesize/add-task-flow/02-add-chooser.png',
    label: 'Add chooser',
    note: 'One + button, one choice: a quick note for something fast, or a task with steps of its own.',
  },
  {
    src: '/home/bitesize/add-task-flow/03-add-task-sheet.png',
    label: 'Add a task',
    note: 'Recurring "sets" (Sunday reset, grocery reset) turn a weekly routine into one tap.',
  },
  {
    src: '/home/bitesize/add-task-flow/04-add-task-typing.png',
    label: 'Building the checklist',
    note: 'Each item typed joins a running checklist right below the input, in view as it builds.',
  },
  {
    src: '/home/bitesize/add-task-flow/05-add-task-success.png',
    label: 'Saved',
    note: 'A quiet confirmation, then straight back to the list, task already folded in.',
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
    note: '"Select" turns the grid into a picker, no separate screen needed.',
  },
  {
    src: '/home/bitesize/quick-note-flow/04-three-selected.png',
    label: 'Selected',
    note: 'Checking off a few notes at once surfaces one button: build them into a task together.',
  },
  {
    src: '/home/bitesize/quick-note-flow/05-build-task-sheet.png',
    label: 'Build your task',
    note: "Selected notes carry over as the task's first steps, ready to add more or name it.",
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
    note: 'Tapping a card unfolds it into its checklist, right there, before you commit to starting.',
  },
  {
    src: '/home/bitesize/start-task-flow/03-step-1of4.png',
    label: 'Step 1 of 4',
    note: '"Start task" hands off to a focus screen: one step at a time, a ring that fills as you go.',
  },
  {
    src: '/home/bitesize/start-task-flow/04-step-2of4.png',
    label: 'Step 2 of 4',
    note: "Every screen previews what's next, no wondering what's coming.",
  },
  {
    src: '/home/bitesize/start-task-flow/05-step-3of4.png',
    label: 'Step 3 of 4',
    note: 'By step three the ring is nearly full, a steady signal of how close you are.',
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
  'ADHD brains run on less dopamine, and shame doesn’t fix that. No task ever needs to be finished to count. Come back whenever.'

// Four rules distilled from decisions already made elsewhere on this page
// (the guiding principle above, focus mode's one-step design, Quick
// Notes, Design Considerations) rather than new claims — a scannable
// summary of "how I think," not additional content.
const DESIGN_PRINCIPLES = [
  {
    number: '01',
    title: 'Reward progress, not perfection',
    body: 'Every step forward gets acknowledged. No penalty for stopping partway, come back whenever.',
  },
  {
    number: '02',
    title: 'One thing at a time',
    body: 'Focus mode shows a single step, not the whole list, on purpose. Less on screen at once means less to process.',
  },
  {
    number: '03',
    title: 'Capture without breaking flow',
    body: 'A thought that surfaces mid-task takes one tap to save as a quick note, not a trip to a different app.',
  },
  {
    number: '04',
    title: 'One core object, not two',
    body: 'Notes and tasks stay part of the same system. A note can become a task; nothing lives in two disconnected places.',
  },
]

// Four real passes at the "current focus" card, in order — not redrawn,
// the actual black/white/gray exploration screens. The last frame is the
// one that shipped in spirit (see START_TASK_FRAMES above); the other
// three are what got tried and set aside along the way.
const EARLY_WORK_FRAMES = [
  {
    src: '/home/bitesize/process/01-first-pass.png',
    label: 'First pass',
    note: 'A single focus card with the next task barely peeking out from behind it, and one gesture: swipe to skip.',
  },
  {
    src: '/home/bitesize/process/02-added-structure.png',
    label: 'Added structure',
    note: 'A pace selector and a "parking lot" tab, the early name for Quick Notes.',
  },
  {
    src: '/home/bitesize/process/03-showing-next.png',
    label: "Showing what's next",
    note: '"Up next: laundry," beneath the current task, before getting pulled back out.',
  },
]

// Three closing takeaways, same "icon + bold header + short paragraph"
// format as a lot of case studies end on, so Reflection reads as the
// deliberate close of a full case study instead of two quiet paragraphs
// tacked onto the end. Grounded in what's already true elsewhere on this
// page (the three flows, the scrapped Early Work screens) rather than new
// claims.
const TAKEAWAYS = [
  {
    icon: '🎯',
    title: 'Capturing and starting are different problems',
    body: 'Adding a task rewards speed: sets, a running checklist. Starting one rewards focus: one step, one screen. Two different flows, not one doing double duty.',
  },
  {
    icon: '🗒️',
    title: 'One core object beats two',
    body: 'Quick notes are for anything too small to be a task on its own. Bundling a few into a real task, instead of a separate "promote" flow, kept the app to one object.',
  },
  {
    icon: '✂️',
    title: 'Removing a feature can be the fix',
    body: 'The swipe gesture and the "up next" preview both felt reasonable on paper, but worked against the same goal: staying with one task, not bracing for the next. Cutting them taught as much as anything that shipped.',
  },
]

// The information architecture behind the three flows below — one Home
// screen with three ways in, each looping back to it. Built as boxes and
// arrows (plain HTML, not an imported diagram image) so it stays on-brand
// with the rest of the page instead of looking like a pasted-in Figma
// export.
const FLOW_DIAGRAM = [
  {
    title: 'Add a Task',
    steps: ['Tap +', 'Choose "Task"', 'Add a Task sheet', 'Back to Home, task added'],
  },
  {
    title: 'Quick Notes',
    steps: ['Quick Notes tab', 'Select a few notes', 'Build a Task sheet', 'Back to Home, task added'],
  },
  {
    title: 'Start a Task',
    steps: ['Tap a task card', 'Task expands into steps', 'Focus mode', 'Back to Home, task complete'],
  },
]

// What I'd actually call a win, given there's no real usage data yet —
// personal validation criteria, not invented metrics.
const SUCCESS_CRITERIA = [
  "I open it every morning instead of defaulting back to my notes app.",
  "A task I'd normally avoid gets started because it's broken into steps.",
  'Other people with ADHD say the pacing feels right, not rushed or stressful.',
  "Missing a task doesn't spiral into feeling behind on everything else.",
]

// Sidebar nav data — a flat list of clickable items, except "Flows" which
// groups the three flow sections as indented children instead of listing
// them as three separate top-level items. `index` still lines up 1:1 with
// each section's real position in the page (and its sectionRefs slot) —
// nesting only changes how the sidebar renders, not how many actual
// sections exist or how the scroll-spy tracks them.
const NAV_ITEMS = [
  { label: 'Overview', index: 0 },
  { label: 'Problem', index: 1 },
  {
    label: 'Flows',
    index: 2,
    children: [
      { label: 'Add a Task', index: 2 },
      { label: 'Quick Notes', index: 3 },
      { label: 'Start a Task', index: 4 },
    ],
  },
  { label: 'Design Principles', index: 5 },
  { label: 'Ideation', index: 6 },
  { label: 'Early Work', index: 7 },
  { label: 'Design Considerations', index: 8 },
  { label: 'Reflection', index: 9 },
]

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

export default function BitesizeCaseStudy({ onBack, onNextProject, nextProjectLabel }) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [backHovered, setBackHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)
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
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              // "Flows" itself — bold/navy the moment any of its three
              // children is the active section, not just when its own
              // index is active, so the group reads as "you're somewhere
              // in here" rather than only lighting up on the first child.
              const groupActive = item.children.some((child) => child.index === activeIndex)
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: rpx(10) }}>
                  <button
                    data-cursor-hover="button"
                    onClick={() => scrollToSection(item.index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(15),
                      lineHeight: 1.4,
                      fontWeight: groupActive ? 600 : 400,
                      color: groupActive ? NAVY : 'rgba(0, 0, 0, 0.5)',
                      transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                    }}
                  >
                    {item.label}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(10), paddingLeft: rpx(16), borderLeft: HAIRLINE }}>
                    {item.children.map((child) => {
                      const active = child.index === activeIndex
                      return (
                        <button
                          key={child.label}
                          data-cursor-hover="button"
                          onClick={() => scrollToSection(child.index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            textAlign: 'left',
                            fontFamily: 'var(--font-sans)',
                            fontSize: rpx(14),
                            lineHeight: 1.4,
                            fontWeight: active ? 600 : 400,
                            color: active ? NAVY : 'rgba(0, 0, 0, 0.45)',
                            transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                          }}
                        >
                          {child.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            }

            const active = item.index === activeIndex
            return (
              <button
                key={item.label}
                data-cursor-hover="button"
                onClick={() => scrollToSection(item.index)}
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
                {item.label}
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
            maxWidth: rpx(760),
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${rpx(26)} 0`,
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
          }}
        >
          {METADATA.map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(14), fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                {label}
              </p>
              <p
                style={{
                  margin: `${rpx(10)} 0 0 0`,
                  fontFamily: 'var(--font-sans)',
                  fontStyle: value ? 'normal' : 'italic',
                  fontSize: rpx(16),
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
            It breaks tasks into small steps, captures quick notes on the fly, and walks through one step
            at a time when you're ready to start.
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
            As someone with ADHD, I could never find an app that worked the way my brain does. The real
            barrier was never remembering a task, it was starting one.
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

        {/* Add a Task — moved up to right after Problem so real, finished
            screens show up early instead of after a long stretch of
            process/sketch content (see Ideation and Early Work below). */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
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
            sectionRefs.current[3] = el
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
            sectionRefs.current[4] = el
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

        {/* Design Principles — four rules distilled from decisions made
            elsewhere on this page (see DESIGN_PRINCIPLES above), so how I
            think reads as a scannable summary instead of something you'd
            have to piece together from flow captions. Comes after the
            flows now (not right after Problem) so it reads as "here's the
            logic behind what you just saw" rather than an abstract list
            before any screens exist. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[5] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>A few rules guided everything you just walked through, not just the one principle already mentioned.</Transition>
          <div style={{ marginTop: rpx(28), maxWidth: rpx(820), display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: rpx(32), rowGap: rpx(28) }}>
            {DESIGN_PRINCIPLES.map((principle) => (
              <div key={principle.number}>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), fontWeight: 500, letterSpacing: '0.05em', color: 'rgba(0, 0, 0, 0.35)' }}>
                  {principle.number}
                </p>
                <p style={{ margin: `${rpx(6)} 0 0 0`, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(17), color: 'var(--color-text)' }}>
                  {principle.title}
                </p>
                <p style={{ margin: `${rpx(6)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(15), lineHeight: 1.55, color: 'rgba(0, 0, 0, 0.6)' }}>
                  {principle.body}
                </p>
              </div>
            ))}
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
            sectionRefs.current[6] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Rewinding a bit: all of that started on paper, sketched through a few versions before it was real.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Two ideas stuck: a popup instead of a full add-task page, and bundling "quick wins" into a
            bigger task, which became Quick Notes. Everything else sorted into a create flow, a
            collect-quick-wins flow, and a few task types. A pill nav and a branded loading screen got
            sketched too, but didn't make the cut.
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
                Sorted into the same groups the three flows above are built from.
              </p>
            </div>
          </div>

          {/* The information architecture that came out of that sorting —
              one Home screen, three ways in, each looping back to it. */}
          <p style={{ margin: `${rpx(36)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Which is the shape you already saw above: one shared home screen with three ways in, each one
            looping back to it.
          </p>
          <div style={{ marginTop: rpx(24), maxWidth: rpx(820) }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  border: `2px solid ${NAVY}`,
                  borderRadius: rpx(8),
                  padding: `${rpx(12)} ${rpx(28)}`,
                  background: SCREEN_MAT,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: rpx(15),
                  color: NAVY,
                }}
              >
                Home
              </div>
            </div>
            <p style={{ textAlign: 'center', margin: `${rpx(8)} 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(13), color: 'rgba(0, 0, 0, 0.4)' }}>
              ↓ the same three flows above ↓
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: rpx(20) }}>
              {FLOW_DIAGRAM.map((lane) => (
                <div key={lane.title}>
                  <p
                    style={{
                      margin: `0 0 ${rpx(10)} 0`,
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(12),
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 0, 0, 0.4)',
                      textAlign: 'center',
                    }}
                  >
                    {lane.title}
                  </p>
                  {lane.steps.map((step, i) => (
                    <div key={step}>
                      <div
                        style={{
                          border: HAIRLINE,
                          borderRadius: rpx(8),
                          padding: `${rpx(10)} ${rpx(12)}`,
                          background: '#fff',
                          fontFamily: 'var(--font-sans)',
                          fontSize: rpx(13),
                          lineHeight: 1.4,
                          color: 'var(--color-text)',
                          textAlign: 'center',
                        }}
                      >
                        {step}
                      </div>
                      {i < lane.steps.length - 1 && (
                        <p style={{ textAlign: 'center', margin: `${rpx(4)} 0`, color: 'rgba(0, 0, 0, 0.3)', fontSize: rpx(14) }}>↓</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Early Work & Scrapped Screens — real exploration frames for
            versions of the focus card that didn't make it in, and why. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[7] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Not everything sketched made it into the final build, though.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Low-fidelity explorations, not final UI, kept for what they ruled out. One version paired
            swipe right to finish with swipe left to skip, but skipping isn't the opposite of finishing,
            it's just deferring. Another showed "up next" beneath the current task, but seeing what's
            coming felt overwhelming instead of focused.
          </p>
          <p
            style={{
              margin: `${rpx(20)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(12),
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            Low-fi exploration, not final UI
          </p>
          {/* Same mat treatment as the Problem section's three screens —
              one shared background instead of three individually-labeled
              tiles, since these three are one group, not a sequence. */}
          <div style={{ marginTop: rpx(12), maxWidth: rpx(820), background: SCREEN_MAT, padding: rpx(28), borderRadius: rpx(12) }}>
            <div style={{ display: 'flex', gap: rpx(20) }}>
              {EARLY_WORK_FRAMES.map((frame) => (
                <div key={frame.label} style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: rpx(8) }}>
                  <div style={{ border: HAIRLINE, borderRadius: rpx(8), overflow: 'hidden', background: '#fff' }}>
                    <ClickableImage src={frame.src} alt={frame.label} onClick={() => setLightbox({ src: frame.src, alt: frame.label })} />
                  </div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), fontWeight: 500, color: 'var(--color-text)' }}>{frame.label}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(14), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.6)' }}>{frame.note}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Design Considerations — a few quieter decisions that were about
            accessibility more than aesthetics, called out on their own so
            they don't just live as unremarked-on details elsewhere on the
            page. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[8] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>A few quieter decisions here were about accessibility more than aesthetics.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Color.</strong> A small set of
            soft blues and neutral tones, never more than one or two accents at once. A loud interface
            would work against an app built to reduce overwhelm.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Pacing.</strong> No timer, no
            countdown. The ring fills as steps get done, not as time runs out: progress without pressure.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Cognitive load.</strong> One
            step at a time in focus mode, and cutting the "up next" preview, came from the same logic: less
            on screen means less to process.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Visual style.</strong> Kept
            deliberately low-stimulation. Nothing decorative, the interface just does what it needs to and
            stops there.
          </p>
        </motion.section>

        {/* Reflection — the deliberate close of a full case study, given
            more visual weight than every other section (extra top space, a
            divider, a bigger heading) instead of reading as two quiet
            paragraphs tacked onto the end. */}
        <div style={{ marginTop: rpx(96), maxWidth: rpx(820), borderTop: HAIRLINE }} />
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[9] = el
          }}
          style={{ marginTop: rpx(40) }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: rpx(13),
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            Reflection
          </p>
          <p style={{ margin: `${rpx(14)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(38), lineHeight: 1.25, color: 'var(--color-text)' }}>
            Here's what building Bitesize actually taught me.
          </p>

          <div style={{ marginTop: rpx(36), display: 'flex', flexDirection: 'column', gap: rpx(28), maxWidth: rpx(820) }}>
            {TAKEAWAYS.map((takeaway) => (
              <div key={takeaway.title} style={{ display: 'flex', gap: rpx(16), alignItems: 'flex-start' }}>
                <span style={{ fontSize: rpx(22), lineHeight: 1.4 }}>{takeaway.icon}</span>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(19), color: 'var(--color-text)' }}>
                    {takeaway.title}
                  </p>
                  <p style={{ margin: `${rpx(6)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
                    {takeaway.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Success criteria — no real usage data yet, so this is stated
              as personal validation goals rather than invented metrics. */}
          <div style={{ marginTop: rpx(40), maxWidth: rpx(820) }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: rpx(13),
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              What success looks like
            </p>
            <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
              No real usage data yet, so here's what I'd actually call a win:
            </p>
            <div style={{ marginTop: rpx(14), display: 'flex', flexDirection: 'column', gap: rpx(10) }}>
              {SUCCESS_CRITERIA.map((item) => (
                <div key={item} style={{ display: 'flex', gap: rpx(10), alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: NAVY, lineHeight: 1.6 }}>✓</span>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where this goes next — forward-looking, so kept visually
              distinct from the three backward-looking takeaways above
              rather than folded into that list as a fourth lesson. */}
          <div style={{ marginTop: rpx(40), maxWidth: rpx(820), paddingLeft: rpx(24), borderLeft: `3px solid ${NAVY}` }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: rpx(13),
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              Where this goes next
            </p>
            <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
              Turn this into something usable, not just prototyped: a live app I run day to day, then open
              it up to other people with ADHD. Their experience won't match mine exactly, and the app
              should reflect that range.
            </p>
          </div>
        </motion.section>

        {/* Next project — a specific next click instead of a generic "see
            more of my work" CTA, since the sidebar already handles general
            navigation back to the grid. */}
        {onNextProject && (
          <div style={{ marginTop: rpx(56), maxWidth: rpx(820), paddingTop: rpx(32), borderTop: HAIRLINE }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
              Next case study
            </p>
            <motion.button
              data-cursor-hover="button"
              onClick={onNextProject}
              onMouseEnter={() => setNextHovered(true)}
              onMouseLeave={() => setNextHovered(false)}
              animate={{ x: nextHovered ? 4 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                marginTop: rpx(8),
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: rpx(28),
                color: NAVY,
              }}
            >
              {nextProjectLabel} →
            </motion.button>
          </div>
        )}
      </motion.div>

      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
