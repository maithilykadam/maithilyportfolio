import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import ScreenFrame from './ScreenFrame.jsx'

// Same navy used for the custom cursor's case-study hover state and
// OpheliaCaseStudy's active nav item — reused here so "active nav item"
// still reads as the same accent color across every case study, not a
// one-off.
const NAVY = '#1e3a8a'

const SECTIONS = ['Overview', 'Solution']

/**
 * Generic case-study page — same structure as OpheliaCaseStudy.jsx (fixed
 * left sidebar with Back + scroll-spy section nav, serif title + tagline,
 * an Overview section with the preview video on the left and a blurb on
 * the right), but data-driven instead of bespoke, so a project can get its
 * own real case-study page just by passing in its title/video/text rather
 * than needing a whole new file written from scratch. Used for Bitesize
 * and OMHS (see WorkContent.jsx) — Ophelia stays on its own dedicated
 * component since its Solution section already has real finished screens
 * and a longer write-up.
 *
 * `screens` is optional and empty for both current uses — the Solution
 * section just shows a small "coming soon" note in that case (same voice
 * as Ophelia's own screens note) instead of an empty grid. Once real
 * wireframes are dropped into each project's public/home/... folder, just
 * pass a `screens` array here (same shape Ophelia's SCREENS uses) and the
 * grid renders itself — nothing else about the page needs to change.
 */
export default function PlaceholderCaseStudy({
  title,
  tagline,
  video,
  overviewText,
  screens = [],
  metadata = [],
  onBack,
  onNextProject,
  nextProjectLabel,
}) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
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
          {title}
        </h1>
        {tagline && (
          <p
            style={{
              margin: `${rpx(10)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {tagline}
          </p>
        )}

        {/* Metadata strip — same styling as Ophelia's and Bitesize's (bigger
            labels, spaced across a fixed max width) rather than a smaller
            one-off, so a project on this generic template still reads as
            equally finished. Only rendered once real Role/Timeline/Team
            values exist for a project (see `metadata` prop, passed in from
            WorkContent.jsx's CASE_STUDY_DATA) rather than always showing a
            row of "Add this" placeholders. */}
        {metadata.length > 0 && (
          <div
            style={{
              marginTop: rpx(28),
              maxWidth: rpx(760),
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${rpx(26)} 0`,
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {metadata.map(({ label, value }) => (
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
        )}

        {/* Overview — the preview video on the left, the blurb filling the
            open space to its right, same as Ophelia. */}
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
          <div
            style={{
              marginTop: rpx(20),
              display: 'flex',
              alignItems: 'flex-start',
              gap: rpx(40),
            }}
          >
            {video && (
              <div
                style={{
                  width: '50%',
                  flexShrink: 0,
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                }}
              >
                <video
                  src={video.src}
                  poster={video.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}
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
              {overviewText}
            </p>
          </div>
        </section>

        {/* Solution — real screens once they exist, a small note in the
            meantime (see the `screens` doc comment above). */}
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
          <p
            style={{
              margin: `${rpx(12)} 0 0 0`,
              fontFamily: 'var(--font-sans)',
              fontStyle: 'italic',
              fontSize: rpx(14),
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            {screens.length > 0
              ? 'Full case study coming soon, in the meantime, here are the finished screens.'
              : 'Wireframes coming soon.'}
          </p>
          {screens.length > 0 && (
            <div
              style={{
                marginTop: rpx(24),
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: rpx(28),
              }}
            >
              {screens.map((screen) => (
                <ScreenFrame key={screen.src} {...screen} />
              ))}
            </div>
          )}
        </section>

        {/* Next project — same understated treatment as Ophelia's and
            Bitesize's, a specific next click instead of a generic "see
            more of my work" CTA. */}
        {onNextProject && (
          <div style={{ marginTop: rpx(56), paddingTop: rpx(32), borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
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
