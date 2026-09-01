import { rpx } from '../../constants/responsive.js'
import WhoGallery from './WhoGallery.jsx'

// The bio copy — an intro line/paragraph followed by three short sections,
// each a small-caps label plus one tight paragraph (trimmed down from a
// couple of paragraphs each — the goal is for the whole column to fit
// without scrolling, not just to read well). Kept as data (not hand-written
// JSX per section) so the left column below is just a straightforward map
// over it.
const BIO_SECTIONS = [
  {
    title: 'DESIGN × ENGINEERING',
    body: [
      "I've been into design since high school, but chose engineering so I'd understand how things actually get built before they ever reach a screen. Now I bring that back into design, with a foot in both worlds.",
    ],
  },
  {
    title: 'PEOPLE PERSON',
    body: [
      "I'm pretty social. I like meeting new people and getting them together around an idea, usually one that starts with 'wait, what if we...'",
    ],
  },
  {
    title: 'BEYOND THE SCREEN',
    body: [
      "Design's a big part of my life, but not all of it. I'm happiest out doing something with people. The rest is probably better explained through the photos :)",
    ],
  },
]

/**
 * Body content for the expanded WHO section. The "WHO" label + "take me
 * back" header (and the filter pills) are rendered generically by
 * Shell.jsx via <ExpandedHeader />; this file only owns what's below it.
 *
 * Two columns now instead of one full-width stack: a fixed-width bio on
 * the left (the intro line + BIO_SECTIONS above), and the photo gallery
 * taking the rest of the width on the right. The bio column scrolls on its
 * own (overflowY: auto) if it ever runs taller than the panel, independent
 * of the gallery — neither column's content should ever force the other to
 * resize. The gallery itself now scrolls naturally too (see
 * WhoGallery.jsx's ScrollingGallery) rather than the old wheel-paged,
 * full-width mechanic — that made sense when photos were the only thing on
 * the page; now that they share the row with real reading copy, a normal
 * scroll reads better than a "one gesture = one whole new set" swap.
 */
export default function WhoContent({ category }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        padding: `${rpx(16)} ${rpx(64)} ${rpx(48)} ${rpx(64)}`,
        gap: rpx(56),
      }}
    >
      {/* Left column — bio text. */}
      <div
        style={{
          width: rpx(360),
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          paddingRight: rpx(8),
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: rpx(38),
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Hi, I'm Maithily :)
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(17),
            lineHeight: 1.5,
            color: 'rgba(0, 0, 0, 0.65)',
            margin: `${rpx(12)} 0 0 0`,
          }}
        >
          I'm a designer, an engineer, and someone who is probably a little too excited to tell you about an idea I
          just had.
        </p>

        {BIO_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginTop: rpx(32) }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(13),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-text)',
              }}
            >
              {section.title}
            </p>
            {section.body.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  margin: `${rpx(10)} 0 0 0`,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(16),
                  lineHeight: 1.55,
                  color: 'rgba(0, 0, 0, 0.65)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Right column — the photo gallery. */}
      <div style={{ flex: '1 1 auto', minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <WhoGallery category={category} />
      </div>
    </div>
  )
}
