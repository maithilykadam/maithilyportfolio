import { motion } from 'framer-motion'
import { FILTERS } from './WhoFilters.jsx'
import { ALL_ITEMS, CATEGORY_PHOTOS, GalleryItem } from './WhoGallery.jsx'

function FilterPill({ label, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        backgroundColor: isActive ? 'rgba(20, 20, 30, 1)' : 'rgba(255, 255, 255, 0)',
        color: isActive ? '#ffffff' : 'var(--color-text)',
        borderColor: isActive ? 'rgba(20, 20, 30, 1)' : 'rgba(0, 0, 0, 0.18)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        padding: '7px 14px',
        borderRadius: '999px',
        borderWidth: '1px',
        borderStyle: 'solid',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      [ {label} ]
    </motion.button>
  )
}

/**
 * Mobile layout for the WHO panel: a short bio snippet at the top, filter
 * pills directly under it, then the photos under the filters, in one
 * normal scrolling page — the order explicitly requested, rather than the
 * desktop's split-screen two-column layout (bio on the left, photos
 * independently scrollable on the right — see WhoContent.jsx).
 *
 * Reuses the real data/components from WhoGallery.jsx (ALL_ITEMS,
 * CATEGORY_PHOTOS, GalleryItem) and WhoFilters.jsx (FILTERS) rather than
 * duplicating them, so there's exactly one source of truth for which
 * photos exist and which category each one belongs to. What's genuinely
 * different here is the layout: a plain CSS-column masonry that's part of
 * the normal page flow (no `position: absolute` height-pinning, no
 * internal scrollbar of its own — see ScrollingGallery in WhoGallery.jsx
 * for that desktop-only version) so it scrolls together with the text and
 * filters above it as one page, the way "scroll through the pictures"
 * implies on a phone. Only 2 columns (vs. desktop's 3) — a photo column
 * narrower than 2-per-row starts looking like a sliver on a ~375-430px
 * screen.
 *
 * Deliberately just the intro line (not the full 3-section bio from
 * WhoContent.jsx) — "a snippet of text," per request, so photos stay the
 * main event instead of a long read gating them.
 *
 * No category context line (CATEGORY_CONTEXT/ALL_CONTEXT) between the
 * filters and the photos — the request was specifically text → filters →
 * photos, so that's left out here even though the desktop layout has it.
 *
 * `category` / `onCategoryChange` — the same lifted state Shell.jsx
 * already threads into the desktop WhoFilters/WhoContent pair, reused here
 * instead of a second independent bit of state.
 */
export default function WhoMobile({ category, onCategoryChange }) {
  const items = category === 'all' ? ALL_ITEMS : (CATEGORY_PHOTOS[category] ?? [])

  return (
    // Top padding (64px) clears MobileNav's fixed top-right menu button,
    // same convention as HomeMobile.jsx.
    <div style={{ padding: '64px 24px 32px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '32px', lineHeight: 1.2, margin: 0 }}>
          Hi, I'm Maithily :)
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.65)', margin: '10px 0 0 0' }}>
          I'm a designer, an engineer, and someone who is probably a little too excited to tell you about an idea I
          just had.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
        {FILTERS.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            isActive={category === filter.id}
            onClick={() => onCategoryChange(filter.id)}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <p style={{ marginTop: '24px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(0, 0, 0, 0.4)' }}>
          Photos coming soon.
        </p>
      ) : (
        <div style={{ columnCount: 2, columnGap: '12px', marginTop: '24px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: '12px' }}>
              <GalleryItem item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
