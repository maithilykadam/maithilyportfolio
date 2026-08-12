import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { PLAYGROUND_ITEMS } from './playgroundItems.js'

/**
 * Body content for the expanded PLAYGROUND section — restyled to match the
 * WHO gallery's bento/masonry look (see WhoGallery.jsx) instead of the old
 * "list on the left, single live preview on the right" layout: a few fixed
 * columns, items distributed round-robin, each image at its own natural
 * aspect ratio (no cropping), same rpx(4) corner rounding and rpx(16)
 * gaps, same staggered left-to-right column fade-in.
 *
 * Unlike WHO, this doesn't need PagedGallery's wheel-to-page mechanic —
 * there are only a handful of pieces so far and this panel already scrolls
 * (see the `overflow: 'hidden auto'` wrapper in Shell.jsx), so it just
 * flows normally and grows downward as more pieces get added, rather than
 * paging between sets.
 *
 * Each piece is still a link straight to its original file (PDF, or the
 * full-size image itself for a piece with no separate PDF), same as before.
 */
function chunkIntoColumns(items, columns) {
  const cols = Array.from({ length: columns }, () => [])
  items.forEach((item, i) => cols[i % columns].push(item))
  return cols
}

// Multi-page pieces (Menu Design, Mini Mag) show every page stacked, not
// just the first — a small hairline gap between pages, same as one grid
// column of the WHO gallery, so a 4-page piece just reads as a slightly
// taller stack than a 1-page one rather than hiding pages 2+ entirely.
function PlaygroundPiece({ item }) {
  return (
    <a href={item.file} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(4) }}>
        {item.thumbnails.map((src) => (
          <img
            key={src}
            src={src}
            alt={item.title}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: rpx(4) }}
          />
        ))}
      </div>
      <p
        style={{
          margin: `${rpx(8)} 0 0 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(14),
          color: 'rgba(0, 0, 0, 0.55)',
        }}
      >
        {item.title}
      </p>
    </a>
  )
}

export default function PlayContent() {
  const columns = chunkIntoColumns(PLAYGROUND_ITEMS, 4)

  return (
    <div style={{ padding: `${rpx(24)} ${rpx(64)} ${rpx(64)}` }}>
      <p
        style={{
          margin: `0 0 ${rpx(24)} 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(16),
          lineHeight: 1.4,
          color: 'rgba(0, 0, 0, 0.6)',
          maxWidth: rpx(700),
        }}
      >
        A few pieces made just for the fun of it — event tickets, a menu, a mini mag, a colour palette, an art deco
        poster. Click any one to open the full file.
      </p>

      {/* Mini Mag's, Menu Design's, Art Deco's, and Colour Palette's
          columns get extra flex-grow so they render noticeably bigger
          than the others — they're the pieces worth lingering on, and
          giving them more room reads more intentional than every column
          being forced to the same width regardless of what's in it. Art
          Deco and Colour Palette each share a column with an Olympic
          ticket, so those tickets grow along with them — same tradeoff
          as any column-based sizing. */}
      <div style={{ display: 'flex', gap: rpx(16), alignItems: 'flex-start' }}>
        {columns.map((column, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: rpx(16),
              flex: column.some((item) =>
                ['mini-mag', 'menu-design', 'art-deco', 'colour-palette'].includes(item.id),
              )
                ? '1.6 1 0'
                : '1 1 0',
              minWidth: 0,
            }}
          >
            {column.map((item) => (
              <PlaygroundPiece key={item.id} item={item} />
            ))}
          </motion.div>
        ))}
      </div>

      <p
        style={{
          margin: `${rpx(32)} 0 0 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(14),
          color: 'rgba(0, 0, 0, 0.35)',
        }}
      >
        more pieces coming soon
      </p>
    </div>
  )
}
