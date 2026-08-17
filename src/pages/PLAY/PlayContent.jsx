import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
 * Clicking a piece opens it in an in-page lightbox (stacked full-size pages,
 * same as the grid but bigger) rather than a new browser tab — keeps you in
 * the site's own custom-cursor/flat-image world instead of dropping into a
 * bare tab with the system cursor and no chrome. `href`/`target="_blank"`
 * are still left on the link underneath as a fallback (cmd/ctrl-click,
 * middle-click, right-click → open in new tab still all work natively) —
 * only a plain left click is intercepted to open the lightbox instead. The
 * lightbox also has its own explicit "Open original file" link for anyone
 * who wants the real PDF/browser viewer.
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
// Title + the software it was made in sit above the piece now (same
// caption styling as the case-study titles under the home page boxes —
// see WorkHomeContent.jsx — just flipped to the top here) instead of
// below, so the credit line is read before the piece rather than after.
function PlaygroundPiece({ item, onOpen }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={item.file}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover="expand"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        // Only take over a plain left click — modifier/middle clicks (new
        // tab, new window, etc.) fall through to the real link untouched.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        onOpen(item)
      }}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{ marginBottom: rpx(8) }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(17),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          {item.title}
        </p>
        <p
          style={{
            margin: `${rpx(2)} 0 0 0`,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(13),
            color: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          {item.software}
        </p>
      </div>
      {/* Relative wrapper around the whole stack (not each page
          individually) so the hover scrim reads as "this piece", not a
          separate dim per page. */}
      <div style={{ position: 'relative' }}>
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.12)',
            borderRadius: rpx(4),
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease-out',
            pointerEvents: 'none',
          }}
        />
      </div>
    </a>
  )
}

// Full-page pieces stacked at a bigger size than the grid, in a scrollable
// centered card over a dark backdrop. Closes on backdrop click, the ✕
// button, or Escape.
function PlaygroundLightbox({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        padding: `${rpx(56)} ${rpx(64)}`,
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: rpx(560), flexShrink: 0, height: 'fit-content' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: rpx(16),
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: rpx(26),
                color: '#ffffff',
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                margin: `${rpx(4)} 0 0 0`,
                fontFamily: 'var(--font-sans)',
                fontSize: rpx(13),
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              {item.software}
            </p>
          </div>
          <button
            data-cursor-hover="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: rpx(4),
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(20),
              lineHeight: 1,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            ✕
          </button>
        </div>

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

        <a
          href={item.file}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover="button"
          style={{
            display: 'inline-block',
            marginTop: rpx(16),
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(13),
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          Open original file ↗
        </a>
      </motion.div>
    </motion.div>
  )
}

export default function PlayContent() {
  const columns = chunkIntoColumns(PLAYGROUND_ITEMS, 4)
  const [openItem, setOpenItem] = useState(null)

  return (
    <div style={{ padding: `${rpx(24)} ${rpx(64)} ${rpx(64)}` }}>
      <p
        style={{
          margin: `0 0 ${rpx(24)} 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(16),
          lineHeight: 1.4,
          color: 'rgba(0, 0, 0, 0.6)',
          maxWidth: '90%',
        }}
      >
        When I'm not doing product design in Figma, I'm usually making something just because, in Adobe Illustrator
        and InDesign. Click any piece to open the full file.
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
              <PlaygroundPiece key={item.id} item={item} onOpen={setOpenItem} />
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

      <AnimatePresence>
        {openItem && <PlaygroundLightbox item={openItem} onClose={() => setOpenItem(null)} />}
      </AnimatePresence>
    </div>
  )
}
