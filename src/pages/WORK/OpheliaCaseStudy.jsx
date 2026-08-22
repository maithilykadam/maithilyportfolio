import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import ScreenFrame from './ScreenFrame.jsx'

// Same navy used for the custom cursor's case-study hover state — reused
// here so "active nav item" reads as the same accent color everywhere on
// the site, not a one-off.
const NAVY = '#1e3a8a'
const HAIRLINE = '1px solid rgba(0, 0, 0, 0.1)'
// Ophelia's own accent color (see previewColor in projects.js) — reused as
// the fill for the not-yet-recorded "in motion" GIF slots, same idea as
// the WORK grid's "coming soon" boxes: a project's own soft color reads as
// "this one, just not ready yet" rather than a flat gray placeholder.
const ACCENT = '#e8d4c9'
// A pale tint of Ophelia's real brand green, Neon Mint (see BRAND_COLORS
// below) — used as the mat behind each flow's video, so that background
// ties back to the actual brand instead of being an arbitrary color.
const VIDEO_MAT = 'rgba(101, 252, 159, 0.32)'

// Shared scroll-in animation for every section below — fades and rises
// into place as it enters the viewport, `once: true` so it doesn't
// re-trigger scrolling back up. Spread onto each `motion.section`.
const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px 0px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

// Ophelia's real brand palette, pulled from the actual Figma brand
// guidelines (Branding Ophelia board) — not invented. Obsidian is the
// brand's near-black, used here instead of plain #000 for the dark
// wordmark card below.
const BRAND_COLORS = [
  { name: 'Neon Mint', hex: '#65FC9F' },
  { name: 'Quiet Ash', hex: '#BDBDBD' },
  { name: 'Obsidian', hex: '#0B0D11' },
  { name: 'Pure White', hex: '#FFFFFF' },
]

const METADATA = [
  { label: 'Role', value: 'UX Designer' },
  { label: 'Timeline', value: 'Jan – Apr 2026' },
  { label: 'Team', value: 'Founders, developers, and designers, all closely involved' },
  { label: 'Platform', value: 'Web' },
]

// The page's real content: a short pitch, then each of the 3 core flows
// from the shot list as its own section — heading, one-line caption, its
// real screens, then a placeholder "GIF coming soon" card for that flow's
// not-yet-recorded clip. This is deliberately NOT a research-driven
// Problem/Process narrative (there isn't real content for that yet) — each
// flow section carries its own "why this exists" in the caption instead,
// and having 3 separate flow sections is what scatters the real screens
// through the page rather than clustering them all in one place or
// holding them back until the end.
//
// NOTE: the screen groupings below are a best-effort guess from the
// filenames/alt text, not confirmed — `ophelia-scroll-view` and
// `ophelia-selection` in particular could belong somewhere else. Easy to
// move a screen to a different flow's `screens` array if a guess is wrong.
//
// `nav` is the short sidebar label (kept distinct from `title`, the fuller
// section heading, the same way the reference case study's sidebar says
// "Onboarding Users" while the section itself can say more).
// `body` is a short paragraph of write-up under each flow's caption — some
// of this is invented/plausible-sounding design rationale rather than
// verified fact (explicitly asked for, to keep this from reading as a bare
// screenshot gallery). Swap any of it out once real specifics exist.
// Grouped by theme rather than one section per feature — Explore, Search,
// and Templates are all "getting to the right place on the canvas";
// Prompt & Refine and Ask for Changes are both "editing what's already
// there"; Multi-Reference and Multi-Select are both "using more than one
// asset at once." Each screen still gets its own caption underneath (see
// FlowScreens), so nothing gets lost by combining the sections themselves.
// Every screen below carries a `note` — a short line of design rationale
// ("why this exists"), not a literal UI-state label ("Gallery view").
// That's the difference between a screenshot dump and documented design
// thinking: a recruiter should be able to tell what problem each screen is
// actually solving without me standing there explaining it.
const FLOWS = [
  {
    nav: 'Explore & Organize',
    transition: 'From there, into the product itself, starting with just finding your way around.',
    title: 'A library, not a blank canvas',
    caption: 'Recent work, search, and templates surface up front, so starting never means staring at an empty page.',
    video: { src: '/home/ophelia/new-project-flow.mp4', poster: '/home/ophelia/new-project-flow-poster.jpg' },
    videoCaption: 'Starting a new project, prompt to first result.',
    screens: [],
  },
  {
    nav: 'Editing Tools',
    transition: "Once something exists on the canvas, editing it needed to be just as easy as making it.",
    title: 'Edit in place, not in another tab',
    caption: 'Prompting, natural-language edits, and timeline trims all happen right where the work already lives.',
    video: { src: '/home/ophelia/adding-media-to-board.mp4', poster: '/home/ophelia/adding-media-to-board-poster.jpg' },
    videoCaption: 'Adding a new image or video straight onto the board, alongside what’s already there.',
    // No static screens here — the video above already covers this flow
    // live, and the old ones (canvas view, scroll view, ask-for-changes)
    // were stale next to it once the site had moved on since they were shot.
    screens: [],
  },
  {
    nav: 'Multi-Asset',
    transition: "And sometimes, one reference or one past generation just isn't enough on its own.",
    title: 'More than one reference at a time',
    caption: 'Multi-reference and multi-select combine several images or past generations into a single prompt.',
    video: { src: '/home/ophelia/selection-ask-flow.mp4', poster: '/home/ophelia/selection-ask-flow-poster.jpg' },
    videoCaption: 'Selecting multiple assets, then asking for a change in plain language.',
    screens: [
      { src: '/home/ophelia/ophelia-multiple-generations.jpg', alt: 'Multiple generations', note: 'Variations render side by side, so comparing options doesn’t mean regenerating one at a time.' },
      { src: '/home/ophelia/wireframes/selection.png', alt: 'Multiple assets selected and attached', note: 'Batch-selecting several assets turns combining references into one action.' },
    ],
  },
]

// The 5-frame slice of Ophelia's real first-run walkthrough that got
// dropped into public/home/ophelia/onboarding — a guided tutorial rather
// than a single feature, so it gets its own section instead of living in
// FLOWS. Captions describe what's on screen; the in-app copy (quoted) is
// real, not written for this page.
const ONBOARDING = [
  {
    src: '/home/ophelia/onboarding/step-1-welcome.png',
    step: 'Welcome',
    caption: '"Welcome, Henrique." A skippable ~2-minute walkthrough before the first prompt.',
  },
  {
    src: '/home/ophelia/onboarding/step-2-first-prompt.png',
    step: 'First prompt',
    caption: '"Let Ophelia take it from here." Attach an asset, describe the outcome.',
  },
  {
    src: '/home/ophelia/onboarding/step-3-reasoning.png',
    step: 'Agent reasoning',
    caption: 'Shows Ophelia interpreting intent and mapping the visual flow before generating.',
  },
  {
    src: '/home/ophelia/onboarding/step-4-generating.png',
    step: 'Generating',
    caption: '"Each model loads differently." A status update instead of a blank screen.',
  },
  {
    src: '/home/ophelia/onboarding/step-5-first-edit.png',
    step: 'First edit',
    caption: '"Now let\'s make a change." Teaches editing, not just generating.',
  },
]

// Small, real captures of individual UI moments — a status pill, a toggle
// — rather than a full page, so they don't belong under any single FLOWS
// entry or inside Onboarding's full-page walkthrough. Their own section
// instead, meant to grow as more get recorded (see the comment on
// `video` below for the layout reasoning). Each clip keeps its own native,
// very-wide-and-short aspect ratio rather than being forced into a 16:10
// ScreenFrame.
const DETAILS = [
  {
    title: 'Loading, narrated',
    caption: '"Gathering your canvas" counts up by asset instead of sitting on a blank spinner, then hands off to a plain "have fun creating."',
    video: { src: '/home/ophelia/onboarding-status-pill.mp4', poster: '/home/ophelia/onboarding-status-pill-poster.jpg' },
  },
  {
    title: 'Agent mode',
    caption: 'One toggle swaps manual model/length/resolution controls for "auto picks model and length" when you’d rather not decide.',
    video: { src: '/home/ophelia/agent-mode-toggle.mp4', poster: '/home/ophelia/agent-mode-toggle-poster.jpg' },
  },
  {
    title: 'Ask Ophelia',
    caption: 'Opening the assistant surfaces contextual suggestions ("make it cinematic," "storyboard an idea") before you type anything at all.',
    video: { src: '/home/ophelia/ask-ophelia.mp4', poster: '/home/ophelia/ask-ophelia-poster.jpg' },
  },
]

// A real excerpt from the founders' own written manifesto (their words, not
// invented) — the six-part grid this used to be tried too hard; one strong
// line does more than six small ones competing for attention.
const MANIFESTO_QUOTE =
  'We will not throw ourselves at the feet of tools that automate what is good about the human soul. We refuse.'

// Sidebar nav — Overview, Problem (now includes the manifesto excerpts
// that used to be their own Philosophy section), Branding, Onboarding, one
// entry per flow (see FLOWS above), Details (small individual UI moments,
// see DETAILS above — its own section since they don't belong under any
// one flow or inside Onboarding's full-page walkthrough), and a combined
// Outcomes & Reflection closer instead of two short sections back to back.
const SECTIONS = ['Overview', 'Problem', 'Branding', 'Onboarding', ...FLOWS.map((flow) => flow.nav), 'Details', 'Outcomes & Reflection']

// A short connective line above a section's heading — "which meant...",
// "and then..." — so the page reads as one continuous story as you scroll
// instead of a stack of self-contained blocks. Not real research copy,
// just the narrative thread tying real sections together. This is now the
// most prominent text at the top of each section, not a quiet intro line —
// the idea is a reader should read this first, then the (much smaller)
// feature label below it, then the screens themselves.
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

// Muted italic placeholder line — the visual equivalent of a [FILL IN]
// marker: obviously not-yet-real copy, easy to spot and swap out, styled
// the same way the rest of the site already marks "not ready yet" content
// (see the WORK grid's comingSoon boxes).
function Placeholder({ children, style }) {
  return (
    <p
      style={{
        margin: `${rpx(12)} 0 0 0`,
        fontFamily: 'var(--font-sans)',
        fontStyle: 'italic',
        fontSize: rpx(15),
        lineHeight: 1.6,
        color: 'rgba(0, 0, 0, 0.4)',
        ...style,
      }}
    >
      {children}
    </p>
  )
}

// Every video on this page autoplays muted on load — good for a quiet,
// ambient feel, bad if someone actually wants to stop and look at a frame.
// This wraps a <video> with a small click-to-toggle play/pause button so
// that's possible, instead of the video just running on a loop forever.
// Also doubles as what used to be the static "In motion" badge — the
// button itself is enough to signal "this moves," no label text needed.
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

// One flow's screens + a motion slot, in a row. Pulled out since it's
// shared by every flow section below, just fed different data. Each
// screen's caption is `note` — a line of design rationale, not a literal
// UI-state label — so this reads as documented thinking, not a screenshot
// dump (see the comment on FLOWS above). Fixed 3 columns keeps every
// screen the same size across every flow; a flow with less to show just
// leaves an empty column rather than stretching to fill the row.
function FlowScreens({ flow }) {
  return (
    <>
      {/* A real video, where one exists, gets pulled out of the screens
          grid entirely and shown larger, above it — otherwise it just
          reads as a 6th tile the same size as every static screenshot
          and gets lost. */}
      {flow.video && (
        <div style={{ marginTop: rpx(20), maxWidth: rpx(820) }}>
          {/* Flat treatment, no laptop bezel, but sitting on Ophelia's own
              accent color like a mat around a photo — makes it read as a
              deliberate showcase rather than a screenshot dropped on white,
              and the color tie-in also links it back to the brand palette. */}
          <div style={{ position: 'relative', background: VIDEO_MAT, padding: rpx(28), borderRadius: rpx(12) }}>
            <div style={{ position: 'relative', border: HAIRLINE, overflow: 'hidden', borderRadius: rpx(6) }}>
              <PlayableVideo src={flow.video.src} poster={flow.video.poster} />
            </div>
          </div>
          <p
            style={{
              margin: `${rpx(8)} 0 0`,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              lineHeight: 1.5,
              color: 'rgba(0, 0, 0, 0.72)',
            }}
          >
            {flow.videoCaption}
          </p>
        </div>
      )}
      {/* Flex row with a fixed tile width instead of a 3-column grid — a
          grid's leftover columns either sit empty (flow with 1-2 screens)
          or stretch a lone tile to fill the whole row, oversized next to
          every other section's tiles. Fixed width keeps every screen, in
          every flow, the same size regardless of how many there are. Skips
          entirely when a flow has no screens left (its video covers it) so
          there's no empty row taking up space underneath. */}
      {(flow.screens.length > 0 || !flow.video) && (
      <div style={{ marginTop: rpx(20), display: 'flex', flexWrap: 'wrap', gap: rpx(20) }}>
        {flow.screens.map((screen) => (
          <div key={screen.src} style={{ display: 'flex', flexDirection: 'column', gap: rpx(8), width: rpx(360), flexShrink: 0 }}>
            <ScreenFrame {...screen} />
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(16),
                lineHeight: 1.5,
                color: 'rgba(0, 0, 0, 0.72)',
              }}
            >
              {screen.note}
            </p>
          </div>
        ))}
        {/* Placeholder motion slot only shows up for flows that don't have
            a real video yet — the ones that do show it above, larger. */}
        {!flow.video && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(8), width: rpx(360), flexShrink: 0 }}>
            <div
              style={{
                aspectRatio: '16 / 10',
                background: ACCENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${rpx(16)}`,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(11),
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
              >
                GIF coming soon
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(16),
                lineHeight: 1.5,
                color: 'rgba(0, 0, 0, 0.72)',
              }}
            >
              In motion, coming soon.
            </p>
          </div>
        )}
      </div>
      )}
    </>
  )
}

/**
 * Full Ophelia case study — replaces the generic title/description overlay
 * specifically for this one project (see WorkContent.jsx). Kept
 * deliberately short: a hero (title, tagline, hero video, role/timeline/
 * team/platform strip), a one-line Overview, the 3 core flows each as
 * their own section (real screens scattered through the page rather than
 * front-loaded or held to the end), a short Outcomes line, and a closing
 * Reflection. No manufactured Problem/Process narrative — there isn't
 * real research content for that yet, and a thin placeholder version of
 * it would read worse than just not having it. Modeled loosely on
 * rachelchen.tech/projects/1password's metadata-strip format and short,
 * punchy sidebar nav, not its full research-driven structure.
 *
 * Anything the copy doc marked [FILL IN] (role, team size, outcomes
 * specifics, reflection) renders as an italic muted Placeholder line
 * rather than invented content — those are specific decisions/numbers
 * only the person who built Ophelia would know.
 *
 * Sidebar nav scrolls the content via refs + scrollIntoView rather than
 * `#hash` anchors — this is a client-side-routed SPA already living inside
 * a `/work` route, so hash links would fight with react-router instead of
 * just scrolling.
 *
 * The nav also tracks which section is currently in view (via
 * IntersectionObserver scoped to the scrolling content pane, not the
 * window — the page itself never scrolls, only this inner pane does) and
 * turns that item's text navy, same accent as the custom cursor's
 * case-study hover state.
 */
export default function OpheliaCaseStudy({ onBack, onNextProject, nextProjectLabel }) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [backHovered, setBackHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)

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
      // Treat a section as "active" once it's crossed roughly a third of
      // the way down the pane, rather than the instant its top edge
      // appears at the very bottom — feels closer to "this is what
      // you're actually looking at."
      { root, rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Sidebar — fixed, its own scroll only kicks in if the section list
          itself ever gets too tall for the viewport. */}
      <div
        style={{
          width: rpx(260),
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          // Extra bottom padding — the site-wide fixed Resume link sits at
          // bottom-left of the viewport (see ResumeLink.jsx, position:
          // fixed, left: 64px), which overlaps this sidebar's own
          // bottom-left corner. Without this clearance, the last nav item
          // (now "Outcomes & Reflection" since Details got added) can end
          // up sitting right under that fixed pill and unclickable.
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

      {/* Content — the only part that scrolls. */}
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
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: rpx(52),
            color: 'var(--color-text)',
          }}
        >
          Ophelia
        </h1>
        <p
          style={{
            margin: `${rpx(10)} 0 0 0`,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(16),
            color: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          An infinite AI canvas for directing image and video generation
        </p>

        {/* Hero video — the prompt-and-refine demo recording. */}
        <div
          style={{
            marginTop: rpx(28),
            width: '100%',
            maxWidth: rpx(760),
            border: '1px solid rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          }}
        >
          <PlayableVideo src="/home/ophelia/ophelia-demo-6.mp4" poster="/home/ophelia/ophelia-demo-6-poster.jpg" />
        </div>

        {/* Metadata strip. Falls back to italic Placeholder-style text for
            any entry left null in METADATA above, rather than a guess. */}
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
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(14),
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
              >
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

        {/* Overview — the hook + supporting line, short by design. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
          style={{ marginTop: rpx(56) }}
        >
          {/* Kicker, big headline, lighter supporting line, then a
              full-width image underneath — modeled on the reference
              1Password case study's Overview layout instead of the
              side-by-side text+image treatment this had before. */}
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
            Overview
          </p>
          <p
            style={{
              margin: `${rpx(14)} 0 0 0`,
              maxWidth: rpx(820),
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: rpx(42),
              lineHeight: 1.2,
              color: 'var(--color-text)',
            }}
          >
            Most AI tools give you one prompt, one static result.
          </p>
          <p
            style={{
              margin: `${rpx(16)} 0 0 0`,
              maxWidth: rpx(820),
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(17),
              lineHeight: 1.6,
              color: 'rgba(0, 0, 0, 0.55)',
            }}
          >
            Ophelia treats generation like directing a shoot, prompting, refining, and stitching
            images and video together on one canvas.
          </p>
          <div style={{ marginTop: rpx(32), maxWidth: rpx(820), border: HAIRLINE, borderRadius: rpx(12), overflow: 'hidden' }}>
            <img
              src="/home/ophelia/ophelia-brand-splash.png"
              alt="Ophelia — Generation, directed by you"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </motion.section>

        {/* Problem — includes the founders' manifesto excerpts (see
            PHILOSOPHY below) as their answer to the problem, rather than
            splitting problem and philosophy into two separate sections. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>But most AI tools don't work like a director's toolkit at all.</Transition>
          {/* No screen here on purpose — none of the real screens show the
              problem (they're all Ophelia's own UI, i.e. the solution), so
              forcing one in just misrepresented what it was showing. Text
              full-width, then straight into the manifesto grid below, which
              carries the visual weight instead. */}
          <div style={{ marginTop: rpx(20), maxWidth: rpx(640) }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(15),
                lineHeight: 1.6,
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              Most AI tools sell convenience over control: type a prompt, accept whatever comes
              back. Ophelia's founders wrote a manifesto about this first: give people leverage
              over generation, not a faster handoff.
            </p>
          </div>

          {/* Their answer, in their own words — one real line from the
              manifesto (see MANIFESTO_QUOTE above), plain and undecorated:
              a left rule to mark it as a quote, no card, no color, no
              serif italics — just the words. */}
          <div
            style={{
              marginTop: rpx(32),
              maxWidth: rpx(680),
              paddingLeft: rpx(24),
              borderLeft: '3px solid #1F6B4A',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: rpx(20),
                lineHeight: 1.5,
                color: 'var(--color-text)',
              }}
            >
              {MANIFESTO_QUOTE}
            </p>
            <p
              style={{
                margin: `${rpx(10)} 0 0 0`,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(12),
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(0, 0, 0, 0.4)',
              }}
            >
              From the founders' manifesto
            </p>
          </div>
        </motion.section>

        {/* Branding — real assets exported straight out of the Figma brand
            guidelines into public/home/ophelia (replaces the earlier
            hand-recreated version built before those exports existed). */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Before any of that, the identity that carries it.</Transition>

          {/* Three independent columns (not grid rows) so each one stacks
              tightly on its own content instead of being stretched to match
              whichever column happens to be tallest — that mismatch was
              what left a gap above the mockups last time. */}
          <div style={{ marginTop: rpx(20), display: 'flex', alignItems: 'flex-start', gap: rpx(16) }}>
            {/* Column 1 — logo lockup, then the color palette under it. */}
            <div style={{ width: rpx(480), flexShrink: 0, display: 'flex', flexDirection: 'column', gap: rpx(16) }}>
              <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
                <img
                  src="/home/ophelia/Frame1.png"
                  alt="Ophelia full logo lockup"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: rpx(10) }}>
                {BRAND_COLORS.map((color) => (
                  <div key={color.name} style={{ display: 'flex', flexDirection: 'column', gap: rpx(6) }}>
                    <div style={{ aspectRatio: '1 / 1', background: color.hex, border: HAIRLINE }} />
                    <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: rpx(14), color: 'var(--color-text)' }}>
                      {color.name}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(12), color: 'rgba(0, 0, 0, 0.45)' }}>
                      {color.hex}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 — logomark light, Geist specimen, then that
                mockup, each directly under the last. */}
            <div style={{ width: rpx(235), flexShrink: 0, display: 'flex', flexDirection: 'column', gap: rpx(16) }}>
              <div
                style={{
                  aspectRatio: '2 / 1',
                  background: BRAND_COLORS[3].hex,
                  border: HAIRLINE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src="/home/ophelia/logo_vector.png" alt="Ophelia logomark" style={{ height: rpx(34), width: 'auto' }} />
              </div>
              <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
                <img src="/home/ophelia/3.png" alt="Geist typeface specimen" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
                <img
                  src="/home/ophelia/mockup1.png"
                  alt="Ophelia branded access pass mockup"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            {/* Column 3 — logomark dark, Inter specimen, then that
                mockup. */}
            <div style={{ width: rpx(235), flexShrink: 0, display: 'flex', flexDirection: 'column', gap: rpx(16) }}>
              <div
                style={{
                  aspectRatio: '2 / 1',
                  background: BRAND_COLORS[2].hex,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/home/ophelia/logo_vector.png"
                  alt="Ophelia logomark, reversed"
                  style={{ height: rpx(34), width: 'auto', filter: 'invert(1)' }}
                />
              </div>
              <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
                <img
                  src="/home/ophelia/typography.png"
                  alt="Inter typeface specimen"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
                <img
                  src="/home/ophelia/mockups.png"
                  alt="Ophelia branded poster mockup"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Onboarding — 5 real frames from the actual first-run walkthrough
            (see ONBOARDING above), shown in sequence with the in-app copy
            quoted rather than summarized. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>And the first thing anyone actually sees when they open Ophelia.</Transition>
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            The first two minutes, teaching both how to generate and how to edit.
          </p>
          {/* Scroll hint — the fade at the row's right edge (below) signals
              more content off-screen even before hovering; this label
              spells it out so it doesn't rely on that alone. In line with
              the rest of the text now instead of floated to the right. */}
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
            Scroll to see all {ONBOARDING.length} →
          </p>
          {/* Horizontally scrollable instead of squeezed into a 5-column
              grid — same "right next to each other, step by step" order,
              but each screen gets to be full size instead of shrunk to
              fit the content width. Wrapped in a relative container so the
              right-edge fade (an absolutely-positioned gradient) can sit on
              top of the row without affecting its layout. */}
          <div style={{ marginTop: rpx(24), position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                gap: rpx(20),
                overflowX: 'auto',
                paddingBottom: rpx(12),
              }}
            >
              {ONBOARDING.map((frame, i) => (
                <div key={frame.step} style={{ display: 'flex', flexDirection: 'column', gap: rpx(8), width: rpx(420), flexShrink: 0 }}>
                  <ScreenFrame src={frame.src} alt={frame.step} />
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
                    {i + 1}. {frame.step}
                  </p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                    {frame.caption}
                  </p>
                </div>
              ))}
            </div>
            {/* Fade over the last ~60px of the row, same color as the page
                background, so the row visually trails off instead of
                cutting the last tile off with a hard edge. */}
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
        </motion.section>

        {/* One section per flow group — real screens scattered through the
            page instead of clustered in one place (see FLOWS above). */}
        {FLOWS.map((flow, i) => (
          <motion.section
            {...REVEAL}
            key={flow.nav}
            ref={(el) => {
              sectionRefs.current[i + 4] = el
            }}
            style={{ marginTop: rpx(72) }}
          >
            {flow.transition && <Transition>{flow.transition}</Transition>}
            <p
              style={{
                margin: `${rpx(12)} 0 0 0`,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(16),
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              {flow.caption}
            </p>
            <FlowScreens flow={flow} />
          </motion.section>
        ))}

        {/* Details — small, individual UI moments (a status pill, a
            toggle), each a real capture of just that piece rather than a
            full page. Meant to grow as more get recorded, so this renders
            straight off DETAILS above rather than being hand-laid-out. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[FLOWS.length + 4] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>And a few smaller moments worth calling out on their own.</Transition>
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            The little interactions that don't need a whole section of their own, just a closer look.
          </p>
          {/* 2-column grid instead of a full-width stack — each clip is
              small on its own, so pairing them up keeps the section from
              stretching every card to the same width as the flow videos
              above, which made them look bigger than they needed to be. */}
          <div style={{ marginTop: rpx(24), display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: rpx(24), rowGap: rpx(28) }}>
            {DETAILS.map((detail) => (
              <div key={detail.title}>
                <p
                  style={{
                    margin: `0 0 ${rpx(8)} 0`,
                    fontFamily: 'var(--font-sans)',
                    fontSize: rpx(13),
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  {detail.title}
                </p>
                <div style={{ position: 'relative', background: VIDEO_MAT, padding: rpx(20), borderRadius: rpx(12) }}>
                  <div style={{ position: 'relative', border: HAIRLINE, overflow: 'hidden', borderRadius: rpx(6) }}>
                    <PlayableVideo src={detail.video.src} poster={detail.video.poster} />
                  </div>
                </div>
                <p
                  style={{
                    margin: `${rpx(8)} 0 0`,
                    fontFamily: 'var(--font-sans)',
                    fontSize: rpx(16),
                    lineHeight: 1.5,
                    color: 'rgba(0, 0, 0, 0.72)',
                  }}
                >
                  {detail.caption}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Outcomes & Reflection — combined into one closing section rather
            than two short ones back to back. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[FLOWS.length + 5] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which is where Ophelia stands today, and what came out of building it.</Transition>
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              maxWidth: rpx(820),
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              lineHeight: 1.6,
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            Ophelia's canvas is live and in the hands of early users, and it hasn't sat still since.
            Onboarding, the multi-select flow, and the canvas toolbar have all shipped meaningful
            revisions since launch, each one driven by a specific piece of user feedback rather than
            a scheduled redesign.
          </p>
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              maxWidth: rpx(820),
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              lineHeight: 1.6,
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            Designing for a product this early meant the spec was never really final. Every flow in
            this case study is a snapshot of where Ophelia is right now, not where it'll stay, and
            that constant iteration ended up being the actual job: staying close enough to real usage
            to know what to change next.
          </p>
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
    </div>
  )
}
