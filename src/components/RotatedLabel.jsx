import { motion } from 'framer-motion'
import { SLIDE_TRANSITION } from '../constants/layout.js'
import { rpx } from '../constants/responsive.js'

/**
 * The rotated, centered label shown inside a collapsed column
 * (e.g. "WORK", "PLAYGROUND", or "MAITHILY KADAM" standing in for WHO).
 * The column itself (in Shell.jsx) owns width, borders, and the hover-widen
 * affordance — this label is the actual click target that navigates.
 *
 * Fades in/out across the *entire* slide, overlapping with whatever it's
 * replacing, so there's never a moment where the column looks empty.
 */
export default function RotatedLabel({ label, fontSize = 70, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={SLIDE_TRANSITION}
      style={{
        position: 'absolute',
        top: 'var(--collapsed-anchor, 42%)',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-90deg)',
        transformOrigin: 'center',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-serif)',
        fontWeight: 400,
        fontSize: rpx(fontSize),
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {label}
    </motion.div>
  )
}
