import { motion } from 'framer-motion'

// Same three roles as the desktop hero (HeroContent.jsx) — kept as its own
// small copy here rather than importing HeroContent's local (unexported)
// constant, since this is otherwise a fully separate mobile layout, not a
// scaled-down reuse of the desktop component.
const ROLES = ['engineering @ waterloo', 'experience design @ ontario government', 'prev product design @ Ophelia']

// All 4 real case studies (not just the 3 featured on the desktop home
// page's asymmetric grid) — on mobile there's no separate WORK grid page
// to send people to (see the HomeMobile doc comment below), so this is the
// complete list, not a "featured 3 of N" preview. Bitesize is the one not
// in the desktop home page's rotation of 3; its video source is the same
// one WorkContent.jsx uses for the WORK grid. Orbit Mobile Design is left
// off — it's a real project slot on the desktop WORK grid but has no
// written-up case study yet (shown there as an inactive "coming soon"
// box), so there's nothing for a mobile card to link to.
const FEATURED_PROJECTS = [
  {
    title: 'Ophelia AI Interface',
    video: { src: '/home/ophelia/ophelia-demo-6.mp4', poster: '/home/ophelia/ophelia-demo-6-poster.jpg' },
    navKey: 'ophelia',
  },
  {
    title: 'REGi Internal Tool',
    video: { src: '/home/ontario/live-regi-demo.mp4', poster: '/home/ontario/live-regi-demo-poster.jpg' },
    navKey: 'liveRegi',
  },
  {
    title: 'Bitesize',
    video: { src: '/home/bitesize/bitesize-demo.mp4', poster: '/home/bitesize/bitesize-demo-poster.jpg' },
    navKey: 'bitesize',
  },
  {
    title: 'Oakville & Milton Humane Society',
    video: {
      src: '/home/humanesociety/humanesociety-demo.mp4',
      poster: '/home/humanesociety/humanesociety-demo-poster.jpg',
    },
    navKey: 'omhs',
  },
]

function ProjectCard({ title, video, onClick }) {
  return (
    // Full width, same as before — shorter instead of narrower: a wider
    // aspect ratio (16/10 vs. the old 4/3) cuts down how tall/massive each
    // preview reads without shrinking the width.
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        marginTop: '20px',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          borderRadius: '10px',
          background: '#000',
        }}
      >
        <video
          src={video.src}
          poster={video.poster}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <p
        style={{
          margin: '10px 0 0 0',
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          color: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        {title}
      </p>
    </button>
  )
}

/**
 * A genuinely separate mobile layout for the home panel — not the desktop
 * HeroContent + WorkHomeContent + PlaygroundRail trio scaled down via
 * rpx(). Two problems with the "just scale it down" version specifically:
 *
 *   1. Layout: the desktop home page is a fixed, non-scrolling 100vh
 *      panel with the hero text absolutely overlaid across the WHOLE
 *      panel and the 3 project boxes arranged in an asymmetric 2-column
 *      grid, offset to start partway across the screen (see
 *      HOME_WORK_OFFSET in Shell.jsx) so it doesn't collide with the wide
 *      hero text box. On a ~375-430px phone there's nowhere near enough
 *      width for that side-by-side arrangement — the grid columns and the
 *      hero box compress into narrow, cramped slivers instead of
 *      reflowing into something readable.
 *   2. Typography: rpx() scales every value by the same width-relative
 *      ratio, but that ratio degenerates very differently depending on
 *      how small the base value already is — a 170px heading (ratio
 *      ~11.8vw) still looks like a reasonable ~44px on a phone, but a
 *      23px tagline (ratio ~1.6vw) shrinks to something like 6px,
 *      illegible. See useIsMobile.js for more on this.
 *
 * This fixes both: a single scrolling column (name → tagline → roles →
 * all 4 project cards stacked full-width), with its own fixed, sensible
 * sizing instead of rpx(). Left-aligned, same as the desktop layout.
 *
 * No separate WORK page on mobile, and no "view all" link to one — with
 * everything already in one vertical line, a second page listing the same
 * 4 case studies again would just be a redundant extra tap, so all 4 live
 * right here instead (see FEATURED_PROJECTS above). The /work route and
 * its grid still exist for desktop; mobile just never links to them.
 *
 * No Playground entry point on the page itself either — it's already one
 * tap away in MobileNav's menu (see MobileNav.jsx), so a second link to it
 * here would just be a duplicate of something already accessible from
 * every panel, not a second real path to it.
 *
 * `onWho` / `onOphelia` / `onLiveRegi` / `onBitesize` / `onOMHS` — the
 * same navigation callbacks Shell.jsx already builds for the desktop
 * layout, just threaded through here instead.
 */
export default function HomeMobile({ onWho, onOphelia, onLiveRegi, onBitesize, onOMHS }) {
  const navFor = { ophelia: onOphelia, liveRegi: onLiveRegi, bitesize: onBitesize, omhs: onOMHS }

  return (
    // Top padding (64px vs. 24px on the other sides) clears MobileNav's
    // fixed top-right menu button so it never overlaps the name heading.
    <div style={{ padding: '64px 24px 24px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        {/* Uppercase MAITHILY KADAM, same serif/weight treatment as the
            desktop hero (HeroContent.jsx). One line (not stacked like the
            desktop version) — size is vw-driven (not just clamped at the
            edges) specifically so "MAITHILY KADAM" always fits on that one
            line across phone widths instead of wrapping. */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: 'clamp(26px, 8.5vw, 44px)',
            lineHeight: 1.05,
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          MAITHILY KADAM
        </h1>

        {/* Tagline (+ its "click for more" CTA) on the left, roles list on
            the right — side by side rather than stacked, in two evenly
            split columns (flex: 1 1 0 on both) rather than the roles
            column being a narrow afterthought next to a much wider
            tagline. */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              a product designer trying to make the internet a little less frustrating (and a lot prettier)
            </p>

            <button
              onClick={onWho}
              style={{
                marginTop: '14px',
                padding: 0,
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.55)',
              }}
            >
              click for more →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 0', minWidth: 0 }}>
            {ROLES.map((role) => (
              <p key={role} style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.35, color: 'rgba(0, 0, 0, 0.6)' }}>
                {role}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: '48px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '22px' }}>Work</p>

        {FEATURED_PROJECTS.map((project) => (
          <ProjectCard key={project.title} title={project.title} video={project.video} onClick={navFor[project.navKey]} />
        ))}
      </div>
    </div>
  )
}
