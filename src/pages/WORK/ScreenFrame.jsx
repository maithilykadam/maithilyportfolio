import { rpx } from '../../constants/responsive.js'

// Laptop-style device frame — a dark rounded bezel around the screen with
// a small camera dot at the top, sitting on a lighter keyboard-deck base
// with a trackpad notch, so it reads as "a laptop" the way the reference
// mockup's phone frame reads as "a phone" rather than a bare cropped
// screenshot. Rounded corners + a soft shadow (unlike the rest of the
// site's flat hairline treatment) specifically because this is meant to
// look like a physical device, not a flat image tile.
//
// Pulled out of OpheliaCaseStudy.jsx so every case study's Solution grid
// (Bitesize, OMHS, ...) can reuse the exact same frame instead of each
// page redefining it — see PlaceholderCaseStudy.jsx.
export default function ScreenFrame({ src, alt, objectPosition = 'center' }) {
  return (
    <div>
      <div
        style={{
          background: '#1c1c1e',
          borderRadius: `${rpx(12)} ${rpx(12)} ${rpx(3)} ${rpx(3)}`,
          padding: `${rpx(10)} ${rpx(10)} ${rpx(8)}`,
          boxShadow: '0 18px 34px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: rpx(7) }}>
          <span style={{ width: rpx(5), height: rpx(5), borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
        <div style={{ borderRadius: rpx(4), overflow: 'hidden', aspectRatio: '16 / 10' }}>
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
          />
        </div>
      </div>
      {/* keyboard deck / base — just enough to silhouette a laptop's lower
          half rather than a full keyboard illustration. */}
      <div
        style={{
          height: rpx(9),
          margin: `0 ${rpx(-4)}`,
          background: 'linear-gradient(180deg, #ddd 0%, #c4c4c4 100%)',
          borderRadius: `0 0 ${rpx(7)} ${rpx(7)}`,
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: rpx(46), height: rpx(3), marginTop: rpx(-2), background: '#a8a8a8', borderRadius: rpx(2) }} />
      </div>
    </div>
  )
}
