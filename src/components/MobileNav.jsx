import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LABEL } from './BottomStepper.jsx'
import { CONTACT_OPTIONS } from './ContactLink.jsx'
import { RESUME_URL } from './ResumeLink.jsx'

// One row inside the open menu — section links, Resume, and the two
// contact options all share this so the list reads as one consistent
// menu rather than mixed styles per item type.
function MenuRow({ children, isActive, onClick, href, target, rel }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'right',
        background: 'none',
        border: 'none',
        padding: '10px 0',
        fontFamily: 'var(--font-serif)',
        fontSize: '19px',
        color: isActive ? 'var(--color-text)' : 'rgba(0, 0, 0, 0.65)',
        fontWeight: isActive ? 600 : 400,
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * Mobile navigation — a top-right menu button instead of the desktop's
 * bottom-center nav pill (see BottomStepper.jsx), per explicit request:
 * the mobile nav shouldn't just be the desktop treatment moved around, it
 * should read as its own thing. This also replaces the three separate
 * fixed corner pieces (ResumeLink bottom-left, ContactLink bottom-right,
 * BottomStepper bottom-center) that don't have room to coexist on a phone
 * screen — Resume and the two contact options now live inside this same
 * menu instead of floating on their own.
 *
 * A small round icon button (hamburger ↔ close, morphing via a simple
 * rotate/fade rather than swapping icons outright) sits fixed top-right on
 * every panel. Tapping it drops down a short list, right-aligned under the
 * button: the four section names first (reusing BottomStepper's own LABEL
 * map so the wording never drifts out of sync with desktop), then Resume,
 * then Email and LinkedIn directly (no nested reveal — there's already
 * plenty of vertical room in an open dropdown, unlike the cramped fixed
 * corner ContactLink used on desktop). A full-screen invisible backdrop
 * behind the panel closes it on an outside tap.
 */
export default function MobileNav({ active, activeLabel = active, sections, onSelect }) {
  const [open, setOpen] = useState(false)

  const selectSection = (section) => {
    setOpen(false)
    onSelect(section)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          right: '16px',
          zIndex: 20,
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--color-bg)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.14)',
        }}
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <motion.line
            x1="0" x2="18" y1="1" y2="1"
            stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"
            animate={{ y1: open ? 7 : 1, y2: open ? 7 : 1, rotate: open ? 45 : 0 }}
            style={{ transformOrigin: '9px 7px' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
          <motion.line
            x1="0" x2="18" y1="7" y2="7"
            stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
          <motion.line
            x1="0" x2="18" y1="13" y2="13"
            stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"
            animate={{ y1: open ? 7 : 13, y2: open ? 7 : 13, rotate: open ? -45 : 0 }}
            style={{ transformOrigin: '9px 7px' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 15, background: 'rgba(0, 0, 0, 0.15)' }}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 'calc(env(safe-area-inset-top, 0px) + 68px)',
                right: '16px',
                zIndex: 20,
                minWidth: '190px',
                padding: '8px 20px',
                borderRadius: '14px',
                background: 'var(--color-bg)',
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.18)',
              }}
            >
              {sections.map((section) => (
                <MenuRow key={section} isActive={activeLabel === section} onClick={() => selectSection(section)}>
                  {LABEL[section] ?? section}
                </MenuRow>
              ))}

              <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.12)', margin: '6px 0' }} />

              <MenuRow href={RESUME_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                Resume
              </MenuRow>
              {CONTACT_OPTIONS.map((option) => (
                <MenuRow
                  key={option.label}
                  href={option.href}
                  target={option.external ? '_blank' : undefined}
                  rel={option.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {option.label}
                </MenuRow>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
