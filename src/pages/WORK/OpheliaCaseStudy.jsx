import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

// Same navy used for the custom cursor's case-study hover state — reused
// here so "active nav item" reads as the same accent color everywhere on
// the site, not a one-off.
const NAVY = '#1e3a8a'

// Section list from the user's mockup — left sidebar nav, each one a
// scroll target further down the page rather than a separate route (this
// stays a single scrollable case study, not a multi-page flow). For now
// Overview holds the preview video and Solution holds the screen grid —
// more sections/content get added back in later.
const SECTIONS = ['Overview', 'Solution']

// The 7 screens the user dropped into public/home/ophelia, optimized down
// from ~40MB combined to ~1.1MB (see conversion pass). `top`/`center`
// objectPosition picked per-screenshot so nothing important gets cropped
// off inside the frame's fixed aspect ratio.
const SCREENS = [
  { src: '/home/ophelia/ophelia-default.jpg', alt: 'Explore AI Canvas — home', objectPosition: 'top' },
  { src: '/home/ophelia/ophelia-gallery-view.jpg', alt: 'Gallery view' },
  { src: '/home/ophelia/ophelia-macbook-view.jpg', alt: 'Canvas view' },
  { src: '/home/ophelia/ophelia-multiple-generations.jpg', alt: 'Multiple generations' },
  { src: '/home/ophelia/ophelia-projects-home-hover.jpg', alt: 'Projects home — hover state' },
  { src: '/home/ophelia/ophelia-scroll-view.jpg', alt: 'Scroll view' },
  { src: '/home/ophelia/ophelia-selection.jpg', alt: 'Selection state' },
]

// Laptop-style device frame — a dark rounded bezel around the screen with
// a small camera dot at the top, sitting on a lighter keyboard-deck base
// with a trackpad notch, so it reads as "a laptop" the way the reference
// mockup's phone frame reads as "a phone" rather than a bare cropped
// screenshot. Rounded corners + a soft shadow (unlike the rest of the
// site's flat hairline treatment) specifically because this is meant to
// look like a physical device, not a flat image tile.
function ScreenFrame({ src, alt, objectPosition = 'center' }) {
  return (
    <div>
      <div
        style={{
          background: '#1c1c1e',
          borderRadius: `${rpx(12)} ${rpx(12)} ${rpx(3)} ${rpx(3)}`,
          padding: `${rpx(10)} ${rpx(10)} ${rpx(8)}`,
          boxShadow: '0 18px 34px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: rpx(7) }}>
          <span style={{ width: rpx(5), height: rpx(5), borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
        <div style={{ borderRadius: rpx(4), overflow: 'hidden', aspectRatio: '16 / 10' }}>
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
          />
        </div>
      </div>
      {/* keyboard deck / base — just enough to silhouette a laptop's lower
          half rather than a full keyboard illustration. */}
      <div
        style={{
          height: rpx(9),
          margin: `0 ${rpx(-4)}`,
          background: 'linear-gradient(180deg, #ddd 0%, #c4c4c4 100%)',
          borderRadius: `0 0 ${rpx(7)} ${rpx(7)}`,
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: rpx(46), height: rpx(3), marginTop: rpx(-2), background: '#a8a8a8', borderRadius: rpx(2) }} />
      </div>
    </div>
  )
}

/**
 * Full Ophelia case study — replaces the generic title/description overlay
 * specifically for this one project (see WorkContent.jsx). Laid out per the
 * user's mockup: a left sidebar (Back link + section nav) that stays fixed
 * while the right side scrolls, a serif title, the same preview video used
 * on the home page box, a grid of the real product screens (each in a flat
 * device frame), then one long-form section per sidebar item.
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
export default function OpheliaCaseStudy({ onBack }) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

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
          width: rpx(200),
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          padding: `${rpx(32)} ${rpx(24)}`,
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.button
          data-cursor-hover="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }}
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(14),
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
                  fontSize: rpx(13),
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
          padding: `${rpx(32)} ${rpx(64)} ${rpx(96)}`,
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
          Ophelia Canvas AI
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

        {/* Overview — a placeholder blurb plus the preview video. */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
          style={{ marginTop: rpx(56) }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: rpx(28),
              color: 'var(--color-text)',
            }}
          >
            Overview
          </h2>
          {/* Video on the left, the blurb filling the open space to its
              right — rather than stacked, so neither is competing for the
              full page width alone. */}
          <div
            style={{
              marginTop: rpx(20),
              display: 'flex',
              alignItems: 'flex-start',
              gap: rpx(40),
            }}
          >
            <div
              style={{
                width: '50%',
                flexShrink: 0,
                border: '1px solid rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
              }}
            >
              <video
                src="/home/ophelia/ophelia-demo-5.mp4"
                poster="/home/ophelia/ophelia-demo-5-poster.jpg"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <p
              style={{
                margin: 0,
                paddingTop: rpx(8),
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(16),
                lineHeight: 1.6,
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              Ophelia is an infinite AI canvas for creators who want to direct their tools rather than
              hand the work over to them. Instead of one prompt producing one static image, Ophelia
              treats generation as an ongoing, editable process — prompt, refine, and stitch images
              and video together on the same canvas, the way a director works with a crew rather than
              the way a search box returns a result.
            </p>
          </div>
        </section>

        {/* Solution — the screen grid. */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: rpx(28),
              color: 'var(--color-text)',
            }}
          >
            Solution
          </h2>
          {/* Small note — the full write-up isn't ready yet, but the real
              finished screens are, so they're shown here in the meantime
              rather than waiting on the rest of the case study. */}
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontStyle: 'italic',
              fontSize: rpx(14),
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            Full case study coming soon — in the meantime, here are the finished screens.
          </p>
          <div
            style={{
              marginTop: rpx(24),
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: rpx(28),
            }}
          >
            {SCREENS.map((screen) => (
              <ScreenFrame key={screen.src} {...screen} />
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  )
}
