import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ScreenFrame from './ScreenFrame.jsx'
import {
  NAVY,
  HAIRLINE,
  ACCENT,
  VIDEO_MAT,
  BRAND_COLORS,
  METADATA,
  FLOWS,
  ONBOARDING,
  DETAILS,
  MANIFESTO_QUOTE,
  REVEAL,
} from './OpheliaCaseStudy.jsx'

// Same idea as PlayableVideo in OpheliaCaseStudy.jsx (autoplay-muted video +
// a click-to-toggle play/pause button), reimplemented here with fixed px
// sizing instead of rpx(). The desktop version's button/bar dimensions are
// all small values (rpx(28), rpx(3), rpx(6)...) — exactly the range where
// rpx()'s vw-relative scaling degenerates hardest on a phone (see
// useIsMobile.js), so reusing it as-is would shrink the toggle button to a
// few illegible pixels rather than just reading a little smaller.
function MobilePlayableVideo({ src, poster }) {
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
          top: '10px',
          left: '10px',
          width: '32px',
          height: '32px',
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
          <span style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '3px', height: '12px', background: 'white', borderRadius: '1px' }} />
            <span style={{ width: '3px', height: '12px', background: 'white', borderRadius: '1px' }} />
          </span>
        ) : (
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '10px solid white',
              marginLeft: '2px',
            }}
          />
        )}
      </button>
    </div>
  )
}

// Same connective-line role as Transition in OpheliaCaseStudy.jsx, just
// with fixed/clamp sizing instead of rpx() (a 34px serif line degenerates
// to something unreadable at rpx()'s width-relative ratio on a phone).
function MobileTransition({ children }) {
  return (
    <p
      style={{
        margin: '0 0 8px 0',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 'clamp(20px, 6.5vw, 25px)',
        lineHeight: 1.3,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </p>
  )
}

// One flow's screens + motion slot, stacked full-width instead of the
// desktop's fixed-360px flex row — a phone screen has no room to sit two
// 360px tiles side by side, so each screen (and the video, where one
// exists) just takes the full column width in sequence.
function MobileFlowScreens({ flow }) {
  return (
    <>
      {flow.video && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ position: 'relative', background: VIDEO_MAT, padding: '14px', borderRadius: '10px' }}>
            <div style={{ position: 'relative', border: HAIRLINE, overflow: 'hidden', borderRadius: '6px' }}>
              <MobilePlayableVideo src={flow.video.src} poster={flow.video.poster} />
            </div>
          </div>
          <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
            {flow.videoCaption}
          </p>
        </div>
      )}
      {(flow.screens.length > 0 || !flow.video) && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {flow.screens.map((screen) => (
            <div key={screen.src} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ScreenFrame {...screen} />
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                {screen.note}
              </p>
            </div>
          ))}
          {!flow.video && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  aspectRatio: '16 / 10',
                  background: ACCENT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 16px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(0, 0, 0, 0.4)',
                  }}
                >
                  GIF coming soon
                </span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
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
 * Mobile layout for the Ophelia case study — a single scrolling column
 * (matching HomeMobile.jsx / WhoMobile.jsx's pattern) instead of the
 * desktop's fixed sidebar + independently-scrolling content pane. No
 * sidebar nav here at all: there's no room for one next to the content on
 * a phone, and MobileNav's top-right menu already covers general
 * wayfinding — this page just needs its own explicit "back" link, same as
 * the desktop version's, since it's one level deeper than a normal panel.
 *
 * Reuses every real content/data export from OpheliaCaseStudy.jsx (FLOWS,
 * ONBOARDING, DETAILS, METADATA, BRAND_COLORS, MANIFESTO_QUOTE, REVEAL,
 * and the color constants) rather than duplicating it, so there's exactly
 * one source of truth for what this case study actually says. What's
 * different is purely layout and sizing: everything that was arranged in
 * side-by-side columns on desktop (the metadata grid, the 3-column
 * branding layout, the 2-column details grid) is stacked full-width here,
 * and every rpx()-sized value is replaced with a fixed/clamp() one for the
 * same reason as the other mobile pages — rpx()'s width-relative ratio
 * degenerates hard on small base values (see useIsMobile.js).
 *
 * `onBack` is wired by WorkContent.jsx to go straight home rather than to
 * the WORK grid — mobile doesn't have a WORK grid page at all (see the
 * note on FEATURED_PROJECTS in HomeMobile.jsx), so "back" from a case
 * study means back to the one place all of them are listed: the home page.
 */
export default function OpheliaCaseStudyMobile({ onBack, onNextProject, nextProjectLabel }) {
  return (
    // Top padding (64px) clears MobileNav's fixed top-right menu button,
    // same convention as every other mobile page.
    <div style={{ padding: '64px 20px 48px 20px' }}>
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.55)',
        }}
      >
        ← Back
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <h1
          style={{
            margin: '20px 0 0 0',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: 'clamp(34px, 10vw, 44px)',
            color: 'var(--color-text)',
          }}
        >
          Ophelia
        </h1>
        <p style={{ margin: '8px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'rgba(0, 0, 0, 0.5)' }}>
          An infinite AI canvas for directing image and video generation
        </p>

        {/* Hero video */}
        <div style={{ marginTop: '20px', width: '100%', border: '1px solid rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
          <MobilePlayableVideo src="/home/ophelia/ophelia-demo-6.mp4" poster="/home/ophelia/ophelia-demo-6-poster.jpg" />
        </div>

        {/* Metadata — stacked full-width rows instead of the desktop's
            auto-fit column grid, which has no room to lay out side by side
            on a phone. */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0', borderTop: HAIRLINE, borderBottom: HAIRLINE }}>
          {METADATA.map(({ label, value }) => {
            const lines = Array.isArray(value) ? value : value ? [value] : null
            return (
              <div key={label}>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                  {label}
                </p>
                {lines ? (
                  lines.map((line, i) => (
                    <p key={i} style={{ margin: `${i === 0 ? '6px' : '2px'} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--color-text)' }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: '6px 0 0 0', fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(0, 0, 0, 0.4)' }}>
                    Add this
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Overview */}
      <motion.section {...REVEAL} style={{ marginTop: '48px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.45)' }}>
          Overview
        </p>
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(24px, 7.5vw, 30px)', lineHeight: 1.25, color: 'var(--color-text)' }}>
          Most AI tools give you one prompt, one static result.
        </p>
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.55)' }}>
          Ophelia treats generation like directing a shoot, prompting, refining, and stitching images and video
          together on one canvas.
        </p>
        <div style={{ marginTop: '20px', border: HAIRLINE, borderRadius: '10px', overflow: 'hidden' }}>
          <img src="/home/ophelia/ophelia-brand-splash.png" alt="Ophelia: Generation, directed by you" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </motion.section>

      {/* Problem */}
      <motion.section {...REVEAL} style={{ marginTop: '56px' }}>
        <MobileTransition>But most AI tools don't work like a director's toolkit at all.</MobileTransition>
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
          Most AI tools sell convenience over control: type a prompt, accept whatever comes back. Ophelia's founders
          wrote a manifesto about this first: give people leverage over generation, not a faster handoff.
        </p>
        <div style={{ marginTop: '20px', paddingLeft: '16px', borderLeft: '3px solid #1F6B4A' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '17px', lineHeight: 1.5, color: 'var(--color-text)' }}>
            {MANIFESTO_QUOTE}
          </p>
          <p style={{ margin: '8px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
            From the founders' manifesto
          </p>
        </div>
      </motion.section>

      {/* Branding — the desktop's 3 side-by-side columns (logo+palette,
          light logomark+specimen+mockup, dark logomark+specimen+mockup)
          stacked full-width in the same order instead, since there's no
          width to spare for 3 columns on a phone. */}
      <motion.section {...REVEAL} style={{ marginTop: '56px' }}>
        <MobileTransition>Before any of that, the identity that carries it.</MobileTransition>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
            <img src="/home/ophelia/Frame1.png" alt="Ophelia full logo lockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {BRAND_COLORS.map((color) => (
              <div key={color.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ aspectRatio: '1 / 1', background: color.hex, border: HAIRLINE }} />
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '11px', color: 'var(--color-text)' }}>{color.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ aspectRatio: '2 / 1', background: BRAND_COLORS[3].hex, border: HAIRLINE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/home/ophelia/logo_vector.png" alt="Ophelia logomark" style={{ height: '30px', width: 'auto' }} />
          </div>
          <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
            <img src="/home/ophelia/3.png" alt="Geist typeface specimen" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
            <img src="/home/ophelia/mockup1.png" alt="Ophelia branded access pass mockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ aspectRatio: '2 / 1', background: BRAND_COLORS[2].hex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/home/ophelia/logo_vector.png" alt="Ophelia logomark, reversed" style={{ height: '30px', width: 'auto', filter: 'invert(1)' }} />
          </div>
          <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
            <img src="/home/ophelia/typography.png" alt="Inter typeface specimen" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ border: HAIRLINE, overflow: 'hidden' }}>
            <img src="/home/ophelia/mockups.png" alt="Ophelia branded poster mockup" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </motion.section>

      {/* Onboarding — kept as a horizontal scroll row (same idea as
          desktop), just with narrower tiles sized for a phone instead of
          420px. */}
      <motion.section {...REVEAL} style={{ marginTop: '56px' }}>
        <MobileTransition>And the first thing anyone actually sees when they open Ophelia.</MobileTransition>
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
          The first two minutes, teaching both how to generate and how to edit.
        </p>
        <p style={{ margin: '10px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
          Scroll to see all {ONBOARDING.length} →
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
          {ONBOARDING.map((frame, i) => (
            <div key={frame.step} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '250px', flexShrink: 0 }}>
              <ScreenFrame src={frame.src} alt={frame.step} />
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                {i + 1}. {frame.step}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>{frame.caption}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* One section per flow group, same as desktop. */}
      {FLOWS.map((flow) => (
        <motion.section {...REVEAL} key={flow.nav} style={{ marginTop: '56px' }}>
          {flow.transition && <MobileTransition>{flow.transition}</MobileTransition>}
          <p style={{ margin: '10px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>{flow.caption}</p>
          <MobileFlowScreens flow={flow} />
        </motion.section>
      ))}

      {/* Details — a single column instead of the desktop's 2-column grid,
          since each clip is already small and a 2-column grid would
          squeeze them further on a phone. */}
      <motion.section {...REVEAL} style={{ marginTop: '56px' }}>
        <MobileTransition>And a few smaller moments worth calling out on their own.</MobileTransition>
        <p style={{ margin: '10px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
          The little interactions that don't need a whole section of their own, just a closer look.
        </p>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {DETAILS.map((detail) => (
            <div key={detail.title}>
              <p style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>{detail.title}</p>
              <div style={{ position: 'relative', background: VIDEO_MAT, padding: '16px', borderRadius: '10px' }}>
                <div style={{ position: 'relative', border: HAIRLINE, overflow: 'hidden', borderRadius: '6px' }}>
                  <MobilePlayableVideo src={detail.video.src} poster={detail.video.poster} />
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>{detail.caption}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Outcomes & Reflection */}
      <motion.section {...REVEAL} style={{ marginTop: '56px' }}>
        <MobileTransition>Which is where Ophelia stands today, and what came out of building it.</MobileTransition>
        <p style={{ margin: '10px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
          Ophelia's canvas is live and in the hands of early users, and it hasn't sat still since. Onboarding, the
          multi-select flow, and the canvas toolbar have all shipped meaningful revisions since launch, each one
          driven by a specific piece of user feedback rather than a scheduled redesign.
        </p>
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
          Designing for a product this early meant the spec was never really final. Every flow in this case study is
          a snapshot of where Ophelia is right now, not where it'll stay, and that constant iteration ended up being
          the actual job: staying close enough to real usage to know what to change next.
        </p>
      </motion.section>

      {/* Next project */}
      {onNextProject && (
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: HAIRLINE }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
            Next case study
          </p>
          <button onClick={onNextProject} style={{ marginTop: '8px', display: 'block', background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-serif)', fontSize: '24px', color: NAVY }}>
            {nextProjectLabel} →
          </button>
        </div>
      )}
    </div>
  )
}
