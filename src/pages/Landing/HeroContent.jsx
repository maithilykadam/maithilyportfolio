import { motion } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const ROLES = ['engineering @ waterloo', 'experience design @ ontario government', 'prev product design @ Ophelia']

/**
 * The home-page hero: name + tagline, deliberately wide enough to overlap
 * into where the WORK case-study list sits (matching the Figma landing
 * frame). Rendered by Shell.jsx as an absolutely-positioned overlay inside
 * the home panel.
 *
 * The "WHO" title here is a static section label, not a nav button —
 * primary navigation happens through the floating bottom nav pill in
 * Shell.jsx. The "click for more →" link below the tagline is a second,
 * more discoverable way to reach WHO specifically, right where someone's
 * attention already is after reading the tagline. The Resume link that
 * used to live at the bottom of this component now lives in
 * ResumeLink.jsx, fixed across every panel instead of just home.
 *
 * `onWhoClick` — jumps to the WHO panel (Shell's `jumpTo('who')`).
 */
export default function HeroContent({ onWhoClick }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // Top padding halved (64 → 32) vs. the other three sides, per
        // request to tighten up the empty space at the very top of the
        // page specifically.
        padding: `${rpx(32)} ${rpx(64)} ${rpx(64)} ${rpx(64)}`,
        pointerEvents: 'none',
      }}
    >
      {/* WHO / name / tagline. Deliberately wide enough that its box
          spills over into where the WORK case-study list sits, matching
          the Figma landing frame — pointerEvents: 'none' here (and on the
          container above) keeps that overlap from blocking hover/clicks on
          the case study list underneath. The "click for more" link is the
          one interactive thing in here, so it explicitly opts back in to
          pointer events on its own. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: rpx(10),
          width: rpx(813),
          pointerEvents: 'none',
        }}
      >
        {/* "WHO" label removed — the top nav now says WHO already, so this
            was a redundant second label right above the name.
            Load-in sequence — explicit absolute delays (not gaps between
            beats): MAITHILY at 0.5s, KADAM at 0.7s, the caption at 0.9s,
            then everything else — click-for-more, the roles list, and
            the case-study boxes over in WorkHomeContent.jsx — at 1.1s.
            Each still fades over 0.75s (see fadeUp's duration above), so
            at these tight delays every beat is mid-fade when the next
            one starts — a fast, heavily overlapping cascade rather than
            distinct sequential beats. */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: rpx(170),
            lineHeight: rpx(135),
            margin: `${rpx(16)} 0 0 0`,
            whiteSpace: 'nowrap',
          }}
        >
          <motion.span custom={0.5} initial="hidden" animate="show" variants={fadeUp} style={{ display: 'block' }}>
            MAITHILY
          </motion.span>
          <motion.span custom={0.7} initial="hidden" animate="show" variants={fadeUp} style={{ display: 'block' }}>
            KADAM
          </motion.span>
        </h1>

        <motion.p
          custom={0.9}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(23),
            lineHeight: 1.35,
            width: rpx(429),
            margin: `${rpx(16)} 0 0 0`,
          }}
        >
          a product designer trying to make the internet a little less
          frustrating (and a lot prettier)
        </motion.p>

        <motion.button
          data-cursor-hover="button"
          custom={1.1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          onClick={onWhoClick}
          style={{
            width: 'fit-content',
            margin: `${rpx(6)} 0 0 0`,
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: 'auto',
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(14),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          click for more →
        </motion.button>
      </div>

      {/* Roles/experience — a separate block (its own gap below the WHO
          group above) rather than crowded into the same flex column, and
          kept narrow (unlike the WHO/name/tagline block, which is
          deliberately wide) so it stays inside the WHO column instead of
          spilling into the WORK boxes the way the headline does. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: rpx(16),
          width: rpx(220),
          marginTop: rpx(64),
        }}
      >
        {ROLES.map((role) => (
          <motion.p
            key={role}
            custom={1.1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(16),
              lineHeight: 1.3,
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            {role}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
