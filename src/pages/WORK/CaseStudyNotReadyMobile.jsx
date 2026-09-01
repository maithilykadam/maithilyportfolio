import { motion } from 'framer-motion'
import { NAVY, HAIRLINE } from './OpheliaCaseStudy.jsx'

/**
 * Placeholder mobile view for any case study that doesn't have its own
 * mobile layout yet (everything except Ophelia, for now — see
 * OpheliaCaseStudyMobile.jsx). Rather than rendering the desktop's
 * sidebar + content layout at a width it was never designed for, this
 * swaps in a short, honest "not ready yet" message with one clear way
 * forward: a button straight to Ophelia, the one case study that IS
 * mobile-ready right now.
 *
 * `title` is the specific project's own name (openSlot.title in
 * WorkContent.jsx), so the message reads as "this one, specifically" and
 * not a generic dead end reused word-for-word everywhere.
 */
export default function CaseStudyNotReadyMobile({ title, onBack, onViewOphelia }) {
  return (
    <div style={{ padding: '64px 20px 48px 20px' }}>
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.55)',
        }}
      >
        ← Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginTop: '40px' }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            fontSize: '12px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.45)',
          }}
        >
          {title}
        </p>
        <h1
          style={{
            margin: '12px 0 0 0',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: 'clamp(26px, 8vw, 32px)',
            lineHeight: 1.25,
            color: 'var(--color-text)',
          }}
        >
          Not quite ready for mobile yet
        </h1>
        <p
          style={{
            margin: '14px 0 0 0',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          This case study is still laid out for a bigger screen. Come back on a laptop or desktop to see it
          properly, or check out the one case study that is mobile-ready in the meantime.
        </p>

        <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: HAIRLINE }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            Mobile-ready case study
          </p>
          <button
            onClick={onViewOphelia}
            style={{
              marginTop: '8px',
              display: 'block',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              color: NAVY,
            }}
          >
            Ophelia AI Interface →
          </button>
        </div>
      </motion.div>
    </div>
  )
}
