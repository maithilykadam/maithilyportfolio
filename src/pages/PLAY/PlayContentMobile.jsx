import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PLAYGROUND_ITEMS } from './playgroundItems.js'

// One piece, sized for a phone instead of PlayContent.jsx's rpx()-based
// version — the title/software text there (rpx(17)/rpx(13)) is exactly the
// small-base-value range where rpx()'s width-relative scaling degenerates
// on a phone (see useIsMobile.js), so this is a fixed-size reimplementation
// rather than a reuse. No hover scrim (nothing to hover on a touchscreen) —
// tapping just opens the lightbox directly.
function MobilePlaygroundPiece({ item, onOpen }) {
  return (
    <a
      href={item.file}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        onOpen(item)
      }}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{ marginBottom: '6px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(0, 0, 0, 0.55)' }}>{item.title}</p>
        <p style={{ margin: '2px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(0, 0, 0, 0.4)' }}>{item.software}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {item.thumbnails.map((src) => (
          <img key={src} src={src} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
        ))}
      </div>
    </a>
  )
}

// Fixed-size reimplementation of PlaygroundLightbox for mobile — same
// backdrop + centered card + close-on-Escape/backdrop-click behavior, just
// without any rpx() values (a phone-width lightbox has no room for the
// desktop version's rpx(560) fixed card width in the first place).
function MobilePlaygroundLightbox({ item, onClose }) {
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
        padding: '48px 16px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '440px', flexShrink: 0, height: 'fit-content' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '22px', color: '#ffffff' }}>{item.title}</p>
            <p style={{ margin: '4px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>{item.software}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', padding: '4px', fontFamily: 'var(--font-sans)', fontSize: '20px', lineHeight: 1, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {item.thumbnails.map((src) => (
            <img key={src} src={src} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
          ))}
        </div>

        <a
          href={item.file}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '14px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}
        >
          Open original file ↗
        </a>
      </motion.div>
    </motion.div>
  )
}

/**
 * Mobile layout for the PLAYGROUND panel — a 2-column bento-style masonry
 * (same CSS-column technique as WhoMobile.jsx's photo grid) instead of the
 * desktop's hand-assembled left/right split (PlayContent.jsx's
 * LEFT_COLUMNS/RIGHT_COLUMNS, built around a 50/50 blurb+grid layout that
 * has no width to spare on a phone). Every real piece (all of
 * PLAYGROUND_ITEMS, not a curated subset) flows into whichever of the 2
 * columns is shorter at that point, so multi-page pieces (which run taller)
 * and single-image pieces naturally interleave into an uneven, bento-like
 * grid rather than a strict alternating pattern.
 *
 * Reuses the real PLAYGROUND_ITEMS data rather than duplicating it, so
 * there's exactly one source of truth for which pieces exist. The tap
 * behavior (open an in-page lightbox rather than a new tab, unless a
 * modifier key is held) matches the desktop version exactly — see
 * MobilePlaygroundPiece/MobilePlaygroundLightbox above for why they're
 * fixed-size reimplementations rather than direct reuse.
 *
 * "wanna see more? check out my case studies" goes home rather than to
 * /work — mobile has no WORK grid page of its own (see the note on
 * FEATURED_PROJECTS in HomeMobile.jsx), and every case study is already
 * listed right there on the home page.
 */
export default function PlayContentMobile() {
  const [openItem, setOpenItem] = useState(null)
  const navigate = useNavigate()

  return (
    <div style={{ padding: '64px 20px 48px 20px' }}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ margin: '0 0 20px 0', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.6)' }}
      >
        When I'm not doing product design in Figma, I'm usually making something just because, in Adobe Illustrator
        and InDesign. Tap any piece to open the full file.
      </motion.p>

      <div style={{ columnCount: 2, columnGap: '12px' }}>
        {PLAYGROUND_ITEMS.map((item) => (
          <div key={item.id} style={{ breakInside: 'avoid', marginBottom: '20px' }}>
            <MobilePlaygroundPiece item={item} onOpen={setOpenItem} />
          </div>
        ))}
      </div>

      <p style={{ margin: '8px 0 0 0', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(0, 0, 0, 0.35)' }}>more pieces coming soon</p>

      <button
        onClick={() => navigate('/')}
        style={{
          display: 'block',
          margin: '12px 0 0 0',
          padding: 0,
          background: 'none',
          border: 'none',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'rgba(0, 0, 0, 0.55)',
        }}
      >
        wanna see more? check out my case studies →
      </button>

      <AnimatePresence>
        {openItem && <MobilePlaygroundLightbox item={openItem} onClose={() => setOpenItem(null)} />}
      </AnimatePresence>
    </div>
  )
}
