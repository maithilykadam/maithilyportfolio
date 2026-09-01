import { useState } from 'react'
import { motion } from 'framer-motion'
import { PLAYGROUND_RAIL_WIDTH } from '../../constants/layout.js'
import { rpx } from '../../constants/responsive.js'

// Entrance (opacity/y, delayed to match HeroContent's "everything else"
// beat at 1.1s — see HeroContent.jsx) and hover feedback are kept on
// two separate elements deliberately: both animate `opacity` on the same
// motion.div would mean every hover toggle re-runs with the mount's
// 1.1s delay/0.75s duration baked into `transition`, making the hover
// response lag noticeably instead of feeling instant. The outer motion.div owns
// the one-time entrance; the inner plain div owns hover via a plain CSS
// transition, independent of Framer/mount state entirely.
// `video` is optional — { src, poster } — for the one box that now has a
// real screen recording instead of the flat placeholder fill. Autoplay/
// loop/muted/playsInline so it just runs quietly in the background like a
// looping preview clip rather than something you have to press play on.
// `object-fit: cover` here (not `contain`) since this recording is a
// normal-ish ~1.3:1 shape, not the extremely wide/short first draft that
// needed letterboxing to stay legible — cover crops only a little off
// the edges and keeps the rest of the site's "no letterboxing" convention.
// `title` is optional — renders as a small caption below the box rather
// than layered on top of it, so it never fights with the video/imagery
// for legibility. The box itself becomes `flex: 1 1 auto` inside a
// column instead of filling the whole grid cell, so the caption gets its
// own real space rather than overlapping.
//
// `image` is a still-frame fallback for a project with no screen-recording
// demo yet (Live REGi) — same cover treatment as `video`, just a static
// image instead. Only one of `video`/`image` is expected per box.
function PlaceholderBox({ area, onClick, video, image, title }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ gridArea: area, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: rpx(8) }}
    >
      <div
        data-cursor-hover="ring"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          overflow: 'hidden',
          background: video ? '#000' : image ? 'rgb(222, 232, 244)' : 'rgba(0, 0, 0, 0.25)',
          opacity: hovered ? 0.85 : 1,
          transition: 'opacity 0.2s ease-out',
          cursor: 'pointer',
        }}
      >
        {video && (
          <video
            src={video.src}
            poster={video.poster}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        {image && <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />}
      </div>
      {title && (
        <p
          style={{
            margin: 0,
            flexShrink: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(17),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          {title}
        </p>
      )}
    </motion.div>
  )
}

/**
 * Home panel's WORK content: the "WORK" title (a static section label —
 * navigation goes through the floating bottom nav pill in Shell.jsx) and 3
 * placeholder rectangles standing in for real case-study previews.
 *
 * Laid out as an asymmetric grid rather than 3 even stacked boxes — one
 * wide box top-right, two narrower boxes underneath it. The bottom row's
 * left edge runs further left than the top box, out into what used to be
 * empty space between the name column and the boxes; the top box stays
 * pulled right, so the shape isn't just "a rectangle," and the layout
 * doesn't fully close the gap so much as give it a reason to exist (the
 * missing top-left corner). Sizing is all in fr units off one container,
 * so it holds up at any viewport size same as the old flex version did.
 *
 * The titled hover list + floating live preview panel (ProjectPreview.jsx)
 * were scrapped in favor of this simpler placeholder — real case-study
 * imagery goes directly into these boxes later, no separate preview
 * mechanism needed. Each box still jumps to the full WORK page on click.
 *
 * `onNavigate` — go to the WORK grid (used by the "view more projects"
 * link). `onNavigateToOphelia` / `onNavigateToLiveRegi` / `onNavigateToOMHS`
 * — go straight into that project's case study instead of the grid, wired
 * to the Ophelia, Live REGi, and OMHS boxes specifically. OMHS replaced
 * Bitesize in this rotation of 3 (Bitesize's own case study is still up
 * on the full WORK grid, just not one of the 3 featured here).
 */
export default function WorkHomeContent({ onNavigate, onNavigateToOphelia, onNavigateToLiveRegi, onNavigateToOMHS }) {
  return (
    <>
      {/* "WORK" label removed — the top nav (now living at the top of the
          page, see BottomStepper.jsx/Shell.jsx) already says WORK, so a
          second static label here was redundant. */}
      <div
        style={{
          position: 'absolute',
          left: rpx(140),
          top: rpx(50),
          bottom: rpx(90),
          right: `calc(${rpx(PLAYGROUND_RAIL_WIDTH)} + ${rpx(28)})`,
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gridTemplateRows: '1.1fr 1fr',
          gridTemplateAreas: `"viewMore top" "bottomLeft bottomRight"`,
          gap: rpx(20),
        }}
      >
        {/* Sits in what was the empty top-left cell, resting on its
            bottom edge — pulled past the grid's own row gap (20px) with a
            negative margin so it actually hugs the box underneath
            (bottomLeft) instead of just being the closest thing to it
            while still sitting a full gap-width away. */}
        <motion.button
          data-cursor-hover="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          onClick={onNavigate}
          style={{
            gridArea: 'viewMore',
            alignSelf: 'end',
            justifySelf: 'start',
            padding: 0,
            margin: `0 0 ${rpx(-16)} 0`,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(14),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          view more projects →
        </motion.button>

        <PlaceholderBox
          area="top"
          onClick={onNavigateToOphelia}
          video={{ src: '/home/ophelia/ophelia-demo-6.mp4', poster: '/home/ophelia/ophelia-demo-6-poster.jpg' }}
          title="Ophelia AI Interface"
        />
        {/* REGi sits in "bottomRight" (the wider 1.4fr column) rather than
            "bottomLeft" — its recording is noticeably wider than the other
            projects' demo clips, so it gets the wider of the two bottom
            boxes instead of getting cropped tighter to fit the narrow one. */}
        <PlaceholderBox
          area="bottomRight"
          onClick={onNavigateToLiveRegi}
          video={{ src: '/home/ontario/live-regi-demo.mp4', poster: '/home/ontario/live-regi-demo-poster.jpg' }}
          title="REGi Internal Tool"
        />
        <PlaceholderBox
          area="bottomLeft"
          onClick={onNavigateToOMHS}
          video={{ src: '/home/humanesociety/humanesociety-demo.mp4', poster: '/home/humanesociety/humanesociety-demo-poster.jpg' }}
          title="Oakville & Milton Humane Society"
        />
      </div>
    </>
  )
}
