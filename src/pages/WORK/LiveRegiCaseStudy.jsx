import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

// Same accent used across every other case study's active nav item and the
// custom cursor's case-study hover state, so it reads as the same site-wide
// system rather than a one-off.
const NAVY = '#1e3a8a'
const HAIRLINE = '1px solid rgba(0, 0, 0, 0.1)'
// A pale tint of Live REGi's own product blue (the "Enter" button, the
// active nav links) — the mat behind grouped screens, same idea as every
// other case study's own SCREEN_MAT tying a background color back to the
// actual product instead of being arbitrary.
const SCREEN_MAT = 'rgba(26, 86, 219, 0.08)'

const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px 0px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

const METADATA = [
  { label: 'Role', value: 'UX Designer' },
  { label: 'Platform', value: 'Web app (desktop + mobile)' },
  { label: 'Timeline', value: '4 months (May–Aug 2026)' },
  { label: 'Team', value: ['2 UX Designers', '2 UX Researchers'] },
]

// Real screens from the desktop "Analyze draft legislation" flow (public/
// home/ontario/live-regi-desktop) paired with their mobile counterpart
// (public/home/ontario/live-regi-mobile), instead of showing the two
// platforms as separate flows — pairing them makes the desktop-to-mobile
// correlation visible directly, rather than asking the reader to hold one
// flow in memory while scrolling through the other. Grouped into the same
// three beats as before. Mobile's "Layering on a second search" step
// wasn't captured as its own screen (mobile folds that combined-filter
// state straight into the rationale view instead), so that one pair is
// desktop-only — everything else has a real 1:1 match.
const PAIRED_GROUPS = [
  {
    heading: 'Getting a draft in',
    pairs: [
      {
        label: 'Analyze draft text',
        desktop: '/home/ontario/live-regi-desktop/01-new-text-entry.png',
        mobile: '/home/ontario/live-regi-mobile/01-new-text-entry.png',
        note: 'An advisor pastes in one section of a draft regulation at a time, no prompt or comments needed, same entry point on both.',
      },
      {
        label: 'Handling invalid input',
        desktop: '/home/ontario/live-regi-desktop/02-invalid-text-entry.png',
        mobile: '/home/ontario/live-regi-mobile/02-invalid-text-entry.png',
        note: "REGi only reads draft legislative text, so conversational input or an unsupported format surfaces exactly what it can't process, the same explicit message on a smaller screen.",
      },
    ],
  },
  {
    heading: 'Searching and reading results',
    pairs: [
      {
        label: 'Choosing what to search for',
        desktop: '/home/ontario/live-regi-desktop/03-search-options.png',
        mobile: '/home/ontario/live-regi-mobile/03-search-options.png',
        note: 'Overly complex language, regulatory compliance requirements, or outdated language. On mobile, the methodology explainer collapses below the fold instead of competing with the three options up top.',
      },
      {
        label: 'Results for one search',
        desktop: '/home/ontario/live-regi-desktop/04-results-summary.png',
        mobile: '/home/ontario/live-regi-mobile/04-results-summary.png',
        note: "Three flagged instances of complex language. Mobile's results also carry each clause's RCR count and match logic inline, detail the desktop crop above doesn't need to surface as directly since the draft panel sits right alongside it.",
      },
    ],
  },
  {
    heading: 'Going deeper on a result',
    pairs: [
      {
        label: 'Layering on a second search',
        desktop: '/home/ontario/live-regi-desktop/05-clause-selection.png',
        mobile: null,
        note: 'Regulatory compliance requirements added alongside complex language, checkboxes controlling which results actually show. Desktop-only screen, mobile folds this straight into the rationale view below.',
      },
      {
        label: 'Why a clause was flagged',
        desktop: '/home/ontario/live-regi-desktop/06-clause-selected.png',
        mobile: '/home/ontario/live-regi-mobile/05-clause-selected.png',
        note: "Opening a result expands REGi's rationale and highlights the exact matching text back in the submitted draft, so the flag never loses its source, on either platform.",
      },
    ],
  },
]

// Real screens from the desktop tutorial mode (public/home/ontario/
// live-regi-tutorial) — coach marks walking a first-time user through the
// same Analyze flow above, screenshotted mid-tutorial so the marks
// themselves are visible. Grouped the same way as the desktop flow above,
// two per beat, so the coach-mark text is actually legible.
const TUTORIAL_GROUPS = [
  {
    heading: 'Opting in and getting oriented',
    frames: [
      {
        src: '/home/ontario/live-regi-tutorial/01-quick-overview-prompt.png',
        label: 'Opting in',
        note: 'A first-time user gets asked before anything starts: walk through it, or skip straight to using it.',
      },
      {
        src: '/home/ontario/live-regi-tutorial/02-getting-oriented.png',
        label: 'Getting oriented',
        note: 'Coach marks call out the search options, the help button, and the draft-preview toggle before any results exist yet.',
      },
    ],
  },
  {
    heading: 'Reading and reviewing',
    frames: [
      {
        src: '/home/ontario/live-regi-tutorial/03-reading-results.png',
        label: 'Reading results',
        note: 'Once results appear, the tutorial breaks down what the summary counts mean and what each flagged result actually contains.',
      },
      {
        src: '/home/ontario/live-regi-tutorial/04-viewing-rationale.png',
        label: 'Opening a rationale',
        note: 'Selecting a result does two things at once: expands why it was flagged, and highlights that exact spot in the submitted draft.',
      },
    ],
  },
  {
    heading: 'Going further',
    frames: [
      {
        src: '/home/ontario/live-regi-tutorial/05-combining-searches.png',
        label: 'Combining searches',
        note: 'Checking more than one search type filters down to clauses matching any of them, sorted by whichever type was picked last.',
      },
      {
        src: '/home/ontario/live-regi-tutorial/06-alternative-text.png',
        label: 'Suggesting a rewrite',
        note: "REGi doesn't stop at flagging a clause, it proposes specific replacement text alongside the rationale.",
      },
    ],
  },
]

// Real numbers from MRTR's own modeling, not invented for the case study.
// Kept separate from ACCURACY_STATS below because they're a different kind
// of claim: these four are projections ("estimated to save," "could result
// in"), not something already measured.
const IMPACT_STATS = [
  { value: '$31.75M–$34.5M', label: "projected savings for businesses over the 5 years following REGi's full maturity" },
  { value: '$4.70–$5.11', label: 'estimated return per $1 invested' },
  { value: '$6.82M', label: 'projected OPS savings in FY27/28, once fully scaled across all ministries' },
  { value: '$5.32M', label: 'projected annual OPS savings from FY28/29 onward' },
]

// Unlike IMPACT_STATS above, these are measured, not modeled: how often
// REGi's own read of a draft matches reality and matches a policy
// professional's own judgment.
const ACCURACY_STATS = [
  { value: '94%', label: 'of the time, REGi catches the RCRs present in a draft' },
  { value: '95%', label: 'of the time, it correctly identifies and classifies RCRs at scale' },
  { value: '91%', label: "of the time, its classifications match a policy professional's own" },
]

// Sidebar nav data — a flat list of clickable items, except "Flows" which
// groups the three flow sections as indented children. `index` still lines
// up 1:1 with each section's real position in the page (and its
// sectionRefs slot).
const NAV_ITEMS = [
  { label: 'Overview', index: 0 },
  { label: 'Problem', index: 1 },
  {
    label: 'Flows',
    index: 2,
    children: [
      { label: 'Desktop & Mobile', index: 2 },
      { label: 'Tutorial Mode', index: 3 },
    ],
  },
  { label: 'Design Considerations', index: 4 },
  { label: 'Results', index: 5 },
  { label: 'Reflection', index: 6 },
]

// Same connective-line pattern as every other case study's Transition
// component: a short line above a section, so the page reads as one
// continuous story while scrolling instead of a stack of self-contained
// blocks.
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

// Full-screen popout for any image on this page — every screenshot here is
// shown smaller than its native resolution, so clicking one opens it large
// instead of leaving zooming in as the only option. Click the backdrop or
// the × to close.
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
// magnifying-glass badge that fades in on hover, then opens the Lightbox
// on click.
//
// `maxHeight`, when passed, caps the thumbnail at that height rather than
// forcing every image to exactly that height. A screenshot shorter than the
// cap renders at its own natural size, no stretching, no dead space; only a
// screenshot taller than the cap (a long scrolled results list, say) gets
// clipped at the bottom via the wrapper's overflow: hidden. Nothing is
// actually lost by that clip: the Lightbox this opens into always shows the
// complete, uncropped screenshot.
function ClickableImage({ src, alt, onClick, maxHeight }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'zoom-in',
        maxHeight,
        overflow: maxHeight ? 'hidden' : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
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

// Same click-to-pause treatment, and the same clip, as the hover preview on
// the WORK grid (see VIDEO_BY_ID in WorkContent.jsx) — the case study's own
// hero used a static screenshot before there was a real demo recording to
// use instead.
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

// Dense, text-heavy desktop screens (tutorial mode here) don't hold up
// shrunk into a narrow scrolling filmstrip — the coach-mark copy just isn't
// readable. This breaks a flow into a few small named beats (see
// TUTORIAL_GROUPS) and lays out each beat's screens two at a time, wrapping
// to a single column on narrower viewports instead of scrolling. Numbering
// carries on across every group instead of resetting to 1 each time, so it
// still reads as one continuous flow, just broken into readable chunks.
function ScreenFlow({ groups, onImageClick }) {
  let count = 0
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading} style={{ marginTop: rpx(28) }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(17),
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            {group.heading}
          </p>
          <div style={{ marginTop: rpx(14), display: 'flex', alignItems: 'flex-start', gap: rpx(24), flexWrap: 'wrap' }}>
            {group.frames.map((frame) => {
              count += 1
              const n = count
              return (
                <div key={frame.label} style={{ flex: '1 1 420px', minWidth: rpx(360), display: 'flex', flexDirection: 'column', gap: rpx(10) }}>
                  <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                    <ClickableImage
                      src={frame.src}
                      alt={frame.label}
                      maxHeight={rpx(560)}
                      onClick={() => onImageClick?.({ src: frame.src, alt: frame.label })}
                    />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(14),
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {n}. {frame.label}
                  </p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(15), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                    {frame.note}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

// Desktop and mobile shown side by side per step instead of as two separate
// flows — pairing them makes the responsive correlation visible directly.
// Each pair is its own row, so a tall mobile screenshot next to a wide
// desktop one just looks like two different devices (which they are)
// instead of competing for a uniform height against unrelated screens in a
// long multi-item row. `mobile` is optional — the one desktop-only step
// (see PAIRED_GROUPS) just renders without a second column.
function PairedFlow({ groups, onImageClick }) {
  let count = 0
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading} style={{ marginTop: rpx(32) }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(17),
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            {group.heading}
          </p>
          <div style={{ marginTop: rpx(16), display: 'flex', flexDirection: 'column', gap: rpx(28) }}>
            {group.pairs.map((pair) => {
              count += 1
              const n = count
              return (
                <div key={pair.label}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(14),
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {n}. {pair.label}
                  </p>
                  <div style={{ marginTop: rpx(10), display: 'flex', alignItems: 'flex-start', gap: rpx(20) }}>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>
                      <p style={{ margin: `0 0 ${rpx(6)} 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(11), fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.3)' }}>
                        Desktop
                      </p>
                      <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                        <ClickableImage
                          src={pair.desktop}
                          alt={`${pair.label} (desktop)`}
                          maxHeight={rpx(560)}
                          onClick={() => onImageClick?.({ src: pair.desktop, alt: `${pair.label} (desktop)` })}
                        />
                      </div>
                    </div>
                    {pair.mobile && (
                      <div style={{ width: rpx(220), flexShrink: 0 }}>
                        <p style={{ margin: `0 0 ${rpx(6)} 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(11), fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.3)' }}>
                          Mobile
                        </p>
                        <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                          <ClickableImage
                            src={pair.mobile}
                            alt={`${pair.label} (mobile)`}
                            maxHeight={rpx(560)}
                            onClick={() => onImageClick?.({ src: pair.mobile, alt: `${pair.label} (mobile)` })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{ margin: `${rpx(10)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(15), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                    {pair.note}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

export default function LiveRegiCaseStudy({ onBack, onNextProject, nextProjectLabel }) {
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
      {/* Sidebar */}
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
          Live REGi
        </h1>
        <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.5)' }}>
          An AI tool helping Ontario policy advisors catch outdated and overly complex language in draft
          legislation
        </p>

        {/* Hero — the same demo clip used for this project's hover preview
            on the WORK grid, instead of a static screenshot. */}
        <div style={{ marginTop: rpx(28), width: '100%', maxWidth: rpx(760), border: '1px solid rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
          <PlayableVideo src="/home/ontario/live-regi-demo.mp4" poster="/home/ontario/live-regi-demo-poster.jpg" />
        </div>

        {/* Metadata strip — a fixed grid of equal-width columns (not
            flex+space-between, which let a long value's column crowd its
            neighbors) so every label gets consistent room. A value can be
            an array (see Team above) to stack as separate lines instead of
            one run-on line, same idea as a real resume's metadata block. */}
        <div
          style={{
            marginTop: rpx(28),
            maxWidth: rpx(760),
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            columnGap: rpx(32),
            rowGap: rpx(20),
            padding: `${rpx(26)} 0`,
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
          }}
        >
          {METADATA.map(({ label, value }) => {
            const lines = Array.isArray(value) ? value : value ? [value] : null
            return (
              <div key={label}>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(14), fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                  {label}
                </p>
                {lines ? (
                  lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        margin: `${i === 0 ? rpx(10) : rpx(4)} 0 0 0`,
                        fontFamily: 'var(--font-sans)',
                        fontSize: rpx(16),
                        color: 'var(--color-text)',
                      }}
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.4)' }}>
                    Add this
                  </p>
                )}
              </div>
            )
          })}
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
            Legislative language is dense by nature. Live REGi helps the people writing it catch what could
            be clearer before it ships.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.55)' }}>
            Built for Ontario's Ministry of Red Tape Reduction (MRTR), Live REGi is an AI tool policy advisors use
            to scan draft legislation and regulations for outdated references, overly complex phrasing, and
            regulatory compliance requirements, each flag explained rather than just handed over as a black
            box.
          </p>

          {/* A quick preview of where this actually landed (full breakdown
              in Results, further down) — real numbers this early instead of
              asking the reader to wait for proof it works, sized to
              actually catch the eye rather than read as a footnote. */}
          <div style={{ marginTop: rpx(32), display: 'flex', flexWrap: 'wrap', gap: rpx(48) }}>
            {[
              { value: '94%', label: 'RCR detection accuracy' },
              { value: '$1.4M', label: 'in costs already avoided' },
              { value: '13,386 hrs', label: 'of OPS staff work saved' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ paddingLeft: i === 0 ? 0 : rpx(48), borderLeft: i === 0 ? 'none' : HAIRLINE }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(48), lineHeight: 1.1, color: NAVY }}>
                  {stat.value}
                </p>
                <p style={{ margin: `${rpx(6)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(15), color: 'rgba(0, 0, 0, 0.55)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Problem */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which came from a slow, inconsistent part of writing regulation.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Reviewing a draft regulation for outdated wording or unnecessarily complex language is manual
            work today, and it depends on which advisor is doing the reading. Two reviewers can catch
            different things in the same draft. Live REGi gives every advisor the same first pass: a
            consistent, explainable read of the text before it's read by a person.
          </p>
          <p style={{ margin: `${rpx(14)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            It's also a government tool handling legal text, so trust mattered as much as speed. An advisor
            needed to see why something was flagged, not just that it was, and needed to be told clearly
            what the tool couldn't do yet rather than have it fail quietly.
          </p>
        </motion.section>

        {/* Desktop & Mobile — paired step by step instead of shown as two
            separate flows, so the responsive correlation is visible
            directly rather than something to hold in memory across two
            scrolls. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Walking through it on desktop and mobile side by side.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            An advisor pastes in draft text, picks what to search for, and can layer on a second search or
            drill into any flagged clause to see exactly why REGi caught it. Broken into three smaller beats
            below rather than one long scroll, each step shown on both platforms at once.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <PairedFlow groups={PAIRED_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* Tutorial Mode — same desktop flow, walked through with coach
            marks for a first-time user, screenshotted mid-tutorial so the
            marks themselves are visible. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>And for someone using it for the first time, a guided version of that same flow.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            Tutorial mode is opt-in, not forced. Coach marks call out each part of the interface as it
            appears, rather than front-loading everything before there's anything on screen to point at.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <ScreenFlow groups={TUTORIAL_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* Design Considerations */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[4] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>A few decisions here were about trust as much as usability.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Working within a design system.</strong>{' '}
            Ontario's public-facing government sites follow the Ontario Design System closely. Live REGi is
            an internal tool rather than a public-facing service, so as a team we had more room to bring our
            own visual flair to it than a fully public gov page would allow.
          </p>

          {/* Accessibility gets its own callout rather than sitting as just
              another paragraph in the list — it's the one place the leeway
              above explicitly didn't apply, so it gets the visual weight to
              match. */}
          <div
            style={{
              marginTop: rpx(20),
              maxWidth: rpx(820),
              background: SCREEN_MAT,
              padding: rpx(24),
              borderRadius: rpx(12),
            }}
          >
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(18), color: 'var(--color-text)' }}>
              Accessibility, held to the same bar regardless.
            </p>
            <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.65)' }}>
              The Ontario Design System follows accessibility and screen reader support to the letter, and
              the leeway we had elsewhere didn't extend to lowering that bar. Every screen, tutorial mode
              included, still had to meet AODA accessibility requirements: proper contrast, full keyboard
              navigation, and a screen reader experience that actually holds up, the same as any public
              Ontario government service.
            </p>
          </div>

          <p style={{ margin: `${rpx(20)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Explainability.</strong> Every
            flagged clause can expand into a plain-language rationale, and highlights back to the exact spot
            in the submitted draft. An advisor should never have to just take REGi's word for it.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Honest limits.</strong> Instead
            of a generic error, an unsupported input lists exactly what REGi can't process yet, formats,
            length, uploaded documents, so the advisor knows it's a limitation, not a bug.
          </p>
        </motion.section>

        {/* Results — an open, editorial stat layout instead of a wall of
            filled cards: plain numbers with hairline dividers for the
            projected figures, a checkmark list for the measured ones (same
            pattern Bitesize's "What success looks like" uses), and the one
            number that's already realized rather than projected pulled out
            as its own line so the case study isn't implying more certainty
            than each figure actually has. */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[5] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Proof this actually works.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            The full breakdown behind the quick numbers up top: MRTR's own modeled savings first, since
            REGi hasn't reached full maturity yet, then what testing actually measured against real policy
            professionals.
          </p>

          <p style={{ margin: `${rpx(28)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(13), fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
            Projected savings
          </p>
          <div style={{ marginTop: rpx(16), maxWidth: rpx(1040), display: 'flex', flexWrap: 'wrap', gap: rpx(32) }}>
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} style={{ flex: '1 1 200px', paddingTop: rpx(14), borderTop: `2px solid ${NAVY}` }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(32), color: NAVY }}>
                  {stat.value}
                </p>
                <p style={{ margin: `${rpx(8)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(14), lineHeight: 1.4, color: 'rgba(0, 0, 0, 0.6)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p style={{ margin: `${rpx(32)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(13), fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
            Measured accuracy
          </p>
          <div style={{ marginTop: rpx(14), display: 'flex', flexDirection: 'column', gap: rpx(12), maxWidth: rpx(820) }}>
            {ACCURACY_STATS.map((stat) => (
              <div key={stat.label} style={{ display: 'flex', gap: rpx(12), alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(16), color: NAVY }}>✓</span>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.65)' }}>
                  <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>{stat.value}</strong> {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* The one number here that isn't a projection — pulled out as
              its own line, same left-border treatment as the "coming next"
              callout in Reflection below, instead of another filled box. */}
          <div style={{ marginTop: rpx(32), maxWidth: rpx(820), paddingLeft: rpx(24), borderLeft: `3px solid ${NAVY}` }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(16), color: 'var(--color-text)' }}>
              Already realized, not projected.
            </p>
            <p style={{ margin: `${rpx(8)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
              That accuracy has already let REGi re-baseline every regulatory compliance requirement across
              Ontario's legislation, regulations, and forms, avoiding $1.4 million in costs and 13,386
              hours of work for OPS staff.
            </p>
          </div>
        </motion.section>

        {/* Reflection */}
        <div style={{ marginTop: rpx(96), maxWidth: rpx(820), borderTop: HAIRLINE }} />
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[6] = el
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
            Where this stands right now.
          </p>
          <p style={{ margin: `${rpx(18)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            We ran usability testing on these screens and synthesized the findings as a team. That synthesis
            pointed to specific writing changes, mostly around how results and rationale get worded, to make
            REGi easier to understand at a glance. Further testing is still ongoing, so this case study will
            keep getting updated as we learn more.
          </p>
          <div style={{ marginTop: rpx(32), maxWidth: rpx(820), paddingLeft: rpx(24), borderLeft: `3px solid ${NAVY}` }}>
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
              What's coming next on this page
            </p>
            <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
              A closer look at the usability testing synthesis itself, once those visuals are ready to
              share.
            </p>
          </div>
        </motion.section>

        {/* Next project */}
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
