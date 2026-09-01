import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavWord } from './BottomStepper.jsx'
import { CONTACT_OPTIONS } from './ContactLink.jsx'
import { RESUME_URL } from './ResumeLink.jsx'

/**
 * Mobile replacement for the three separate fixed corner elements
 * (ResumeLink bottom-left, ContactLink bottom-right, BottomStepper's nav
 * pill bottom-center) — on a phone-width screen those three independent
 * floating pieces have nowhere near enough room to coexist without
 * overlapping or getting cramped, especially once a page actually scrolls
 * (see HomeMobile.jsx) and content can run underneath all three at once.
 *
 * One full-width fixed bar instead, two rows: a quiet top row with Resume
 * and Contact (secondary actions, small text) at opposite edges, and a
 * primary bottom row with the four section names spaced out like a normal
 * mobile tab bar — the thing someone's thumb actually lands on most often
 * gets the bigger, more deliberate touch target.
 *
 * Reuses the exact same data/components as the desktop trio (NavWord from
 * BottomStepper.jsx — which owns the section-label text itself,
 * CONTACT_OPTIONS from ContactLink.jsx, RESUME_URL from ResumeLink.jsx)
 * rather than re-authoring any of it, so there's exactly one source of
 * truth for labels/links/active-state logic on both layouts.
 *
 * Contact's hover-reveal doesn't have a touch equivalent, so this swaps it
 * for tap-to-toggle: tapping "Contact" opens a small popover with the same
 * Email/LinkedIn options directly above the bar, tapping again (or picking
 * one) closes it.
 */
export default function MobileBottomBar({ active, activeLabel = active, sections, onSelect }) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: 'var(--color-bg)',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.08)',
        // env() safe-area inset so this clears the home-indicator strip on
        // notched phones instead of sitting flush underneath it.
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px',
              padding: '10px 16px 0 16px',
            }}
          >
            {CONTACT_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.external ? '_blank' : undefined}
                rel={option.external ? 'noopener noreferrer' : undefined}
                onClick={() => setContactOpen(false)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--color-text)',
                  padding: '4px 0',
                }}
              >
                {option.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1 — secondary actions. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px 2px 16px',
        }}
      >
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}
        >
          Resume ↗
        </a>
        <button
          onClick={() => setContactOpen((open) => !open)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          Contact {contactOpen ? '↓' : '↑'}
        </button>
      </div>

      {/* Row 2 — primary navigation, tab-bar style. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '6px 8px 10px 8px',
        }}
      >
        {sections.map((section) => (
          <div key={section} style={{ padding: '6px 4px' }}>
            <NavWord section={section} isActive={activeLabel === section} onClick={() => onSelect(section)} />
          </div>
        ))}
      </div>
    </div>
  )
}
