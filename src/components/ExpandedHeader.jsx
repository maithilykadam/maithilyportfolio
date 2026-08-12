import { rpx } from '../constants/responsive.js'

/**
 * Header row for an expanded page: the section label, plus an optional
 * `right` slot (used by WHO for its category filter pills — see
 * WhoFilters.jsx). The "take me back" link that used to sit on the right
 * was removed — the on-screen nav pill (in Shell.jsx) already covers
 * getting back to any section, including home.
 *
 * Top padding, font size, and opacity all match HeroContent's own WHO
 * label (padding halved 64 → 32, size 35 → 28, opacity 0.7) so a label
 * like WHO looks and sits exactly the same whether you're looking at it
 * on the landing page or on its own expanded panel.
 */
export default function ExpandedHeader({ label, right }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${rpx(32)} ${rpx(64)} 0 ${rpx(64)}`,
      }}
    >
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: rpx(28), opacity: 0.7, margin: 0 }}>{label}</p>
      {right}
    </div>
  )
}
