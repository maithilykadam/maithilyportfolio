import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

// Keep in sync with the CATEGORIES export in WhoGallery.jsx — this is just
// the label/icon for each pill; WhoGallery owns which photos actually
// belong to each one.
export const FILTERS = [
  { id: 'all', label: 'ALL', icon: '•' },
  { id: 'friends', label: 'FRIENDS', icon: '👥' },
  { id: 'skies-nature', label: 'SKIES & NATURE', icon: '🌤' },
  { id: 'concerts', label: 'CONCERTS', icon: '🎤' },
  { id: 'volleyball', label: 'VOLLEYBALL', icon: '🏐' },
]

/**
 * The bracketed filter pills sitting next to the WHO label — "[ ALL • ]",
 * "[ FRIENDS 👥 ]", etc. Clicking one swaps which photos WhoGallery shows
 * (see the `category` prop threaded through WhoContent → WhoGallery) and
 * a short line of context about what that category means, instead of the
 * usual photo-set-per-scroll-gesture behaviour.
 */
export default function WhoFilters({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: rpx(10), flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {FILTERS.map((filter) => {
        const isActive = value === filter.id
        return (
          <motion.button
            key={filter.id}
            data-cursor-hover="button"
            onClick={() => onChange(filter.id)}
            animate={{
              backgroundColor: isActive ? 'rgba(20, 20, 30, 1)' : 'rgba(255, 255, 255, 0)',
              color: isActive ? '#ffffff' : 'var(--color-text)',
              borderColor: isActive ? 'rgba(20, 20, 30, 1)' : 'rgba(0, 0, 0, 0.18)',
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: rpx(6),
              padding: `${rpx(8)} ${rpx(16)}`,
              borderRadius: '999px',
              borderWidth: 1,
              borderStyle: 'solid',
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(12),
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span>[ {filter.label}</span>
            <span>{filter.icon}</span>
            <span>]</span>
          </motion.button>
        )
      })}
    </div>
  )
}
