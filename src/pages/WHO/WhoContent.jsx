import { rpx } from '../../constants/responsive.js'
import WhoGallery from './WhoGallery.jsx'

/**
 * Body content for the expanded WHO section (name, tagline, photo gallery).
 * The "WHO" label + "take me back" header is rendered generically by
 * Shell.jsx via <ExpandedHeader />; this file only owns what's below it.
 *
 * Laid out as a flex column filling the panel's full height (header block
 * auto-sized, WhoGallery taking whatever's left via flex: 1) rather than
 * stacking normally and letting the page scroll — the gallery is meant to
 * always be fully visible with no scrollbar; see WhoGallery.jsx for how a
 * scroll *gesture* still swaps in a second set of photos without an actual
 * scroll happening.
 *
 * Bottom padding stays modest (48, a normal gutter) rather than reserving
 * a big forced dead zone for the floating bottom nav — a visibly empty
 * band above it read as an abrupt, unintentional cutoff. Instead the nav
 * itself picks up a soft frosted backdrop only when something's actually
 * behind it (see BottomStepper.jsx), so photos can fill the space
 * naturally and legibility is handled locally instead of by carving out
 * empty page real estate.
 */
export default function WhoContent({ category }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: `${rpx(16)} ${rpx(64)} ${rpx(48)} ${rpx(64)}`,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: rpx(88),
          lineHeight: 1.1,
          margin: 0,
          whiteSpace: 'nowrap',
        }}
      >
        MAITHILY KADAM
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(18),
          lineHeight: 1.3,
          width: 'max-content',
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          margin: `${rpx(8)} 0 0 0`,
        }}
      >
        If the panels on the right are what I do, this corner is who I am. A
        collection of film rolls, current fixations, and life away from the
        desk
      </p>

      <WhoGallery category={category} />
    </div>
  )
}
