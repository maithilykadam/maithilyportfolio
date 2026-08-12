import { rpx } from '../../constants/responsive.js'

// Shared chrome for every widget "card" in the gallery — a real white
// surface (not a grey placeholder) so these read as finished content
// sitting among the still-placeholder photos, the way an actual Pinterest
// board mixes photos with the odd note or link card.
function WidgetCard({ children }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: rpx(14),
        padding: rpx(18),
        borderRadius: rpx(14),
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 28px rgba(0, 0, 0, 0.06)',
      }}
    >
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: rpx(11),
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      {children}
    </p>
  )
}

// Real Spotify track: "Tenerife Sea" by Ed Sheeran (from x, 2014).
// https://open.spotify.com/track/1HbcclMpw0q2WDWpdGCKdS
const SPOTIFY_TRACK_ID = '1HbcclMpw0q2WDWpdGCKdS'

/**
 * "Currently on repeat" — an actual Spotify embed (not a mockup), so
 * pressing play really plays "Tenerife Sea." Spotify's own embed handles
 * album art, track/artist name, and the play button natively — height=80
 * requests their compact single-row layout, which is what fits a masonry
 * card slot. No API key needed; this is Spotify's public embeddable
 * player, the same one used for song links shared anywhere on the web.
 */
export function MusicCard() {
  return (
    <WidgetCard>
      <CardLabel>CURRENTLY ON REPEAT</CardLabel>
      <iframe
        title="Tenerife Sea by Ed Sheeran on Spotify"
        src={`https://open.spotify.com/embed/track/${SPOTIFY_TRACK_ID}?utm_source=generator`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: rpx(8), marginTop: 'auto' }}
      />
    </WidgetCard>
  )
}

// TODO: placeholders — swap for real current interests whenever ready.
const FIXATIONS = ['Interest one', 'Interest two', 'Interest three', 'Interest four']

export function FixationsCard() {
  return (
    <WidgetCard>
      <CardLabel>CURRENT FIXATIONS</CardLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: rpx(8) }}>
        {FIXATIONS.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(13),
              color: 'var(--color-text)',
              padding: `${rpx(6)} ${rpx(12)}`,
              borderRadius: '999px',
              background: 'rgba(0, 0, 0, 0.06)',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </WidgetCard>
  )
}

// Real embeddable map (OpenStreetMap's public embed, no API key needed —
// same idea as the Spotify embed above), centered on Toronto with a pin
// dropped roughly downtown. bbox is the visible map extent; marker is the
// pin's exact lat/lon.
const TORONTO_MAP_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=-79.45%2C43.60%2C-79.31%2C43.70&layer=mapnik&marker=43.6532%2C-79.3832'

export function LocationCard() {
  return (
    <WidgetCard>
      <CardLabel>LOCATION STAMP</CardLabel>
      <div style={{ height: rpx(160), borderRadius: rpx(8), overflow: 'hidden' }}>
        <iframe
          title="Map centered on Toronto, ON"
          src={TORONTO_MAP_SRC}
          style={{ width: '100%', height: '100%', border: 0, display: 'block', filter: 'grayscale(0.3)' }}
          loading="lazy"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: rpx(6) }}>
        <span style={{ fontSize: rpx(13) }}>📍</span>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), color: 'rgba(0, 0, 0, 0.55)' }}>
          Based in Toronto, ON
        </p>
      </div>
    </WidgetCard>
  )
}
