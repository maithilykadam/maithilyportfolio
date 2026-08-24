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
  { label: 'Team', value: '2 UX Designers, 2 UX Researchers' },
]

// Real screens from the desktop "Analyze draft legislation" flow (public/
// home/ontario/live-regi-desktop), in the order a policy advisor would
// actually move through them: paste in text, handle an invalid entry,
// choose what to search for, see results, layer on a second search, then
// drill into why one specific clause got flagged.
const DESKTOP_FRAMES = [
  {
    src: '/home/ontario/live-regi-desktop/01-new-text-entry.png',
    label: 'Analyze draft text',
    note: 'An advisor pastes in one section of a draft regulation at a time, no prompt or comments needed.',
  },
  {
    src: '/home/ontario/live-regi-desktop/02-invalid-text-entry.png',
    label: 'Handling invalid input',
    note: "REGi only reads draft legislative text, so conversational input or an unsupported format surfaces exactly what it can't process yet, instead of a generic error.",
  },
  {
    src: '/home/ontario/live-regi-desktop/03-search-options.png',
    label: 'Choosing what to search for',
    note: 'Overly complex language, regulatory compliance requirements, or outdated language, each with a link to how REGi actually finds it.',
  },
  {
    src: '/home/ontario/live-regi-desktop/04-results-summary.png',
    label: 'Results for one search',
    note: 'Three flagged instances of complex language, with the original submitted draft still visible on the right for reference.',
  },
  {
    src: '/home/ontario/live-regi-desktop/05-clause-selection.png',
    label: 'Layering on a second search',
    note: 'Regulatory compliance requirements added alongside complex language, checkboxes controlling which results actually show.',
  },
  {
    src: '/home/ontario/live-regi-desktop/06-clause-selected.png',
    label: 'Why a clause was flagged',
    note: "Opening a result expands REGi's rationale and highlights the exact matching text back in the submitted draft, so the flag never loses its source.",
  },
]

// Real screens from the same flow, adapted for a single-column mobile
// layout (public/home/ontario/live-regi-mobile). The results view here
// carries extra detail the desktop crop didn't show: each flagged clause
// tagged with its own RCR count and match logic (single clause, multiple
// clauses, AND/OR), not just a category label.
const MOBILE_FRAMES = [
  {
    src: '/home/ontario/live-regi-mobile/01-new-text-entry.png',
    label: 'Analyze draft text',
    note: 'Same entry point, stacked into one column instead of splitting the draft into a side panel.',
  },
  {
    src: '/home/ontario/live-regi-mobile/02-invalid-text-entry.png',
    label: 'Handling invalid input',
    note: 'The same explicit "here\'s what I can\'t process" message, not shortened just because the screen is smaller.',
  },
  {
    src: '/home/ontario/live-regi-mobile/03-search-options.png',
    label: 'Choosing what to search for',
    note: 'The methodology explainer collapses below the fold instead of competing with the three search options up top.',
  },
  {
    src: '/home/ontario/live-regi-mobile/04-results-summary.png',
    label: 'Results, fully tagged',
    note: "Each result carries its own RCR count and match type, single clause, multiple clauses, AND or OR, so nothing gets lost moving between search types.",
  },
  {
    src: '/home/ontario/live-regi-mobile/05-clause-selected.png',
    label: 'Why a clause was flagged',
    note: 'The rationale expands in place, same as desktop, without needing a second panel to hold the source text.',
  },
]

// Sidebar nav data — a flat list of clickable items, except "Flows" which
// groups the two flow sections as indented children. `index` still lines
// up 1:1 with each section's real position in the page (and its
// sectionRefs slot).
const NAV_ITEMS = [
  { label: 'Overview', index: 0 },
  { label: 'Problem', index: 1 },
  {
    label: 'Flows',
    index: 2,
    children: [
      { label: 'Desktop', index: 2 },
      { label: 'Mobile', index: 3 },
    ],
  },
  { label: 'Design Considerations', index: 4 },
  { label: 'Reflection', index: 5 },
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

// A horizontally scrollable row of real screens — same pattern as every
// other case study's Filmstrip: each screenshot shown full size instead of
// shrunk to fit a grid, with a numbered label and a line of rationale
// underneath, and a fade over the row's right edge signaling there's more
// to scroll to.
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

        {/* Hero — a real screen instead of a video, since there's no
            product demo clip for this one yet. */}
        <div style={{ marginTop: rpx(28), width: '100%', maxWidth: rpx(760), border: '1px solid rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
          <ClickableImage
            src="/home/ontario/live-regi-desktop/01-new-text-entry.png"
            alt="Live REGi's draft analysis screen with a sample regulation pasted in"
            onClick={() =>
              setLightbox({
                src: '/home/ontario/live-regi-desktop/01-new-text-entry.png',
                alt: "Live REGi's draft analysis screen with a sample regulation pasted in",
              })
            }
          />
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
            Legislative language is dense by nature. Live REGi helps the people writing it catch what could
            be clearer before it ships.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.55)' }}>
            Built for Ontario's Ministry of Red Tape Reduction, Live REGi is an AI tool policy advisors use
            to scan draft legislation and regulations for outdated references, overly complex phrasing, and
            regulatory compliance requirements, each flag explained rather than just handed over as a black
            box.
          </p>
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

        {/* Desktop flow */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Starting on desktop, where most policy work actually happens.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            An advisor pastes in draft text, picks what to search for, and can layer on a second search or
            drill into any flagged clause to see exactly why REGi caught it.
          </p>
          <Filmstrip frames={DESKTOP_FRAMES} onImageClick={setLightbox} />
        </motion.section>

        {/* Mobile flow */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>The same tool, built to hold up on a smaller screen too.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), color: 'rgba(0, 0, 0, 0.6)' }}>
            Everything from desktop carries over, stacked into one column instead of a split view, with
            nothing shortened or hidden to make it fit.
          </p>
          <Filmstrip frames={MOBILE_FRAMES} onImageClick={setLightbox} />
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
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Explainability.</strong> Every
            flagged clause can expand into a plain-language rationale, and highlights back to the exact spot
            in the submitted draft. An advisor should never have to just take REGi's word for it.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Honest limits.</strong> Instead
            of a generic error, an unsupported input lists exactly what REGi can't process yet, formats,
            length, uploaded documents, so the advisor knows it's a limitation, not a bug.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>Accessibility.</strong> As an
            Ontario government product, the interface has to meet AODA accessibility standards, not as an
            afterthought but as a baseline every screen gets built to.
          </p>
        </motion.section>

        {/* Reflection */}
        <div style={{ marginTop: rpx(96), maxWidth: rpx(820), borderTop: HAIRLINE }} />
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[5] = el
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
              Live REGi's tutorial mode, which walks new users through each step on desktop, plus a closer
              look at the usability testing synthesis itself once those visuals are ready to share.
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
