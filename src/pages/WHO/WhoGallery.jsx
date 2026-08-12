import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'
import { MusicCard, FixationsCard, LocationCard } from './WhoWidgets.jsx'

const WIDGETS = {
  music: MusicCard,
  fixations: FixationsCard,
  location: LocationCard,
}

// Real photos, served from public/who/. Each one keeps its own natural
// aspect ratio — width is fixed (the column's share of the gallery), height
// is whatever that width naturally works out to. Nothing gets cropped to
// fit a preset box.
function Photo({ src }) {
  return <img src={src} alt="" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: rpx(4) }} />
}

function Caption({ text }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: rpx(15),
        lineHeight: 1.4,
        color: 'rgba(0, 0, 0, 0.55)',
      }}
    >
      {text}
    </p>
  )
}

function Widget({ kind }) {
  const Component = WIDGETS[kind]
  return <Component />
}

// Real photos, served from public/who/ (Vite serves anything in public/ at
// the site root, so /who/opt-....jpg). "opt-" prefix marks these as the
// resized/compressed versions of the originals uploaded to that folder —
// the raw uploads were multi-megabyte camera/phone originals, so each one
// was run through ImageMagick (resize to a 1400px-long-edge max, quality
// 78, strip metadata) before landing here, or the page would ship tens of
// megabytes of images.
//
// public/who/ is also split into per-category subfolders (friends/,
// skies-nature/, concerts/, volleyball/) so the filter pills in
// WhoFilters.jsx have something real to show — this map is just "which
// subfolder is this filename in" so PHOTO() can find each one at its new
// path. Anything not listed here is a leftover, uncategorized photo that
// still lives at the folder root (see UNCATEGORIZED_PHOTOS below).
const CATEGORY_OF = {
  '143AF636-D5BF-4D71-AC1F-AC58F4FD6B66': 'skies-nature',
  IMG_0470: 'skies-nature',
  IMG_0696: 'skies-nature',
  IMG_0977: 'skies-nature',
  IMG_1431: 'skies-nature',
  IMG_1881: 'skies-nature',
  IMG_6467: 'skies-nature',
  IMG_6501: 'skies-nature',
  IMG_6879: 'skies-nature',
  IMG_7453: 'skies-nature',
  IMG_1224: 'skies-nature',
  IMG_2178: 'skies-nature',
  '254594185180126454': 'skies-nature',
  '47850814786852553': 'skies-nature',
  'beautiful-sunset-walk-in-lagos-algarve': 'skies-nature',
  'lagos-portugal': 'skies-nature',
  'lisbon-sunset': 'skies-nature',
  'miradouro-em-lisboa': 'skies-nature',
  sky: 'skies-nature',
  'sunset-in-lagos-ponta-da-piedade': 'skies-nature',
  'dreamy-blue-sky-with-soft-white-clouds': 'skies-nature',
  IMG_0334: 'concerts',
  IMG_2184: 'concerts',
  IMG_2199: 'concerts',
  IMG_0008: 'concerts',
  IMG_0016: 'concerts',
  IMG_0022: 'concerts',
  IMG_0331: 'concerts',
  IMG_0333: 'concerts',
  IMG_0336: 'concerts',
  IMG_0339: 'concerts',
  IMG_0340: 'concerts',
  IMG_0344: 'concerts',
  IMG_0356: 'concerts',
  IMG_0360: 'concerts',
  IMG_3095: 'concerts',
  IMG_3098: 'concerts',
  IMG_3306: 'concerts',
  IMG_3311: 'concerts',
  IMG_4618: 'concerts',
  IMG_5950: 'concerts',
  IMG_5972: 'concerts',
  IMG_6012: 'concerts',
  IMG_1332: 'friends',
  IMG_7655: 'friends',
  IMG_8836: 'friends',
  SAM_6599: 'friends',
  '052222_0400': 'volleyball',
  '052222_0493': 'volleyball',
  '052222_0547': 'volleyball',
  '052222_1618': 'volleyball',
  '052222_2794': 'volleyball',
  '052322_0191': 'volleyball',
  '052322_1259': 'volleyball',
  '052322_1680': 'volleyball',
  '052322_1681': 'volleyball',
  '052322_2393': 'volleyball',
  '052422_0370': 'volleyball',
  '122424_0132': 'volleyball',
  '122424_1120': 'volleyball',
  '14D1DF24-DE97-4781-8C65-F1BAFA746AD5': 'volleyball',
  '55F20824-C478-41E4-805A-F2A764668B84': 'volleyball',
  IMG_1136: 'volleyball',
  IMG_3439: 'volleyball',
  IMG_3446: 'volleyball',
  IMG_3447: 'volleyball',
  IMG_3451: 'volleyball',
  IMG_3473: 'volleyball',
  IMG_3486: 'volleyball',
}

const PHOTO = (name) => {
  const folder = CATEGORY_OF[name]
  return folder ? `/who/${folder}/opt-${name}.jpg` : `/who/opt-${name}.jpg`
}

// The photos for each filter pill, grouped by category folder.
const FRIENDS_PHOTOS = ['IMG_1332', 'IMG_7655', 'IMG_8836', 'SAM_6599'].map((name) => ({ src: PHOTO(name) }))

// Deliberately interleaved (not "old photos, then new photos") so a
// recently-added batch doesn't all cluster into the last set or two — each
// newer photo sits next to an older one throughout.
const SKIES_PHOTOS = [
  '143AF636-D5BF-4D71-AC1F-AC58F4FD6B66',
  '254594185180126454',
  'IMG_0470',
  '47850814786852553',
  'IMG_0696',
  'beautiful-sunset-walk-in-lagos-algarve',
  'IMG_0977',
  'lagos-portugal',
  'IMG_1431',
  'lisbon-sunset',
  'IMG_1881',
  'miradouro-em-lisboa',
  'IMG_6467',
  'sky',
  'IMG_6501',
  'sunset-in-lagos-ponta-da-piedade',
  'IMG_6879',
  'dreamy-blue-sky-with-soft-white-clouds',
  'IMG_7453',
  'IMG_1224',
  'IMG_2178',
].map((name) => ({ src: PHOTO(name) }))

const CONCERTS_PHOTOS = [
  'IMG_0334',
  'IMG_0008',
  'IMG_2184',
  'IMG_0016',
  'IMG_2199',
  'IMG_0022',
  'IMG_0331',
  'IMG_3095',
  'IMG_0333',
  'IMG_3098',
  'IMG_0336',
  'IMG_3306',
  'IMG_0339',
  'IMG_3311',
  'IMG_0340',
  'IMG_4618',
  'IMG_0344',
  'IMG_5950',
  'IMG_0356',
  'IMG_5972',
  'IMG_0360',
  'IMG_6012',
].map((name) => ({ src: PHOTO(name) }))

const VOLLEYBALL_PHOTOS = [
  '052222_0400',
  '14D1DF24-DE97-4781-8C65-F1BAFA746AD5',
  '052222_0493',
  'IMG_1136',
  '052222_0547',
  'IMG_3439',
  '052222_1618',
  '55F20824-C478-41E4-805A-F2A764668B84',
  '052222_2794',
  'IMG_3446',
  '052322_0191',
  'IMG_3447',
  '052322_1259',
  '122424_0132',
  '052322_1680',
  '122424_1120',
  '052322_1681',
  'IMG_3451',
  '052322_2393',
  'IMG_3473',
  '052422_0370',
  'IMG_3486',
].map((name) => ({ src: PHOTO(name) }))

const CATEGORY_PHOTOS = {
  friends: FRIENDS_PHOTOS,
  'skies-nature': SKIES_PHOTOS,
  concerts: CONCERTS_PHOTOS,
  volleyball: VOLLEYBALL_PHOTOS,
}

// A line of context for each category — shown above the filtered photo
// grid so a category reads as more than just a photo dump.
const CATEGORY_CONTEXT = {
  friends: 'The people who make it feel like home — campus events, color runs, and everything shared with the people around me.',
  'skies-nature': 'Sunsets, skylines, and the outdoors — where I go to slow down and reset.',
  concerts: 'Live music, from stadium shows to festival stages — some of my favourite nights out.',
  volleyball:
    'Volleyball is such an important part of my life, and it has taught me so much about myself and how to navigate the world.',
}

// A handful of real photos that were never sorted into one of the four
// categories above (still just sitting at the folder root).
const UNCATEGORIZED_PHOTOS = ['IMG_0316', 'IMG_1480', 'IMG_5158', 'IMG_5253', 'IMG_5633'].map((name) => ({
  src: PHOTO(name),
}))

// Round-robins across several photo lists at once — one from each group per
// pass — so ALL isn't "every friends photo, then every skies photo, then
// every concert photo, ...", it's a genuine mix of everything throughout.
function interleave(groups) {
  const result = []
  const longest = Math.max(...groups.map((g) => g.length))
  for (let i = 0; i < longest; i++) {
    for (const group of groups) {
      if (i < group.length) result.push(group[i])
    }
  }
  return result
}

// The caption and the three widget cards (currently-on-repeat song,
// current fixations, location — see WhoWidgets.jsx) spread evenly through
// the interleaved photo list below, rather than all clustered at the very
// start, so ALL still has that personal-Pinterest-board mix of photos and
// "cards" throughout, not just in set one.
const ALL_SPECIAL_ITEMS = [
  {
    caption:
      'Volleyball is such an important part of my life, and it has taught me so much about myself and how to navigate the world',
  },
  { widget: 'fixations' },
  { widget: 'music' },
  { widget: 'location' },
]

function withSpecialItemsSpread(photos, specials) {
  const result = [...photos]
  const step = Math.floor(result.length / (specials.length + 1))
  specials.forEach((item, i) => {
    result.splice(step * (i + 1) + i, 0, item)
  })
  return result
}

// Every real photo across every category, plus the leftovers, interleaved
// and with the caption/widget cards spread through — this is the full
// "everything" view, auto-chunked into same-density scroll-to-page sets by
// chunkIntoSets below (see PagedGallery) rather than a hand-picked pair of
// sets, so it automatically grows as more photos get added to any folder.
const ALL_ITEMS = withSpecialItemsSpread(
  interleave([FRIENDS_PHOTOS, SKIES_PHOTOS, CONCERTS_PHOTOS, VOLLEYBALL_PHOTOS, UNCATEGORIZED_PHOTOS]),
  ALL_SPECIAL_ITEMS,
)

function GalleryItem({ item }) {
  if (item.caption) return <Caption text={item.caption} />
  if (item.widget) return <Widget kind={item.widget} />
  return <Photo src={item.src} />
}

// `registerLastItem`, if given, is called with the DOM node of the LAST
// item in each column — that's the one PagedGallery measures to decide
// whether this column ran past the visible area (see the clip-detection
// note on PagedGallery below).
function GalleryPage({ columns, registerLastItem }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        gap: rpx(16),
      }}
    >
      {/* Each column fades/slides in on its own, staggered by index — the
          left column starts almost immediately and each one after it
          lags a bit more, so the whole set sweeps in left-to-right rather
          than appearing all at once. Exit is quick and uniform (no
          stagger) so the outgoing set clears cleanly before the next one
          sweeps in. */}
      {columns.map((column, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: rpx(16),
            flex: '1 1 0',
            minWidth: 0,
            // Clearance for Resume/the bottom nav is reserved further up,
            // in WhoContent's own bottom padding — that's what actually
            // shrinks the height available to this whole gallery so its
            // content naturally stops short of them. Padding added here,
            // after content that already fills 100% of the (unshrunk)
            // available height, would just get clipped by the panel's
            // `overflow: hidden` instead of ever being visible.
          }}
        >
          {column.map((item, j) => (
            <div key={j} ref={j === column.length - 1 ? registerLastItem?.(i) : undefined}>
              <GalleryItem item={item} />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * The shared scroll-to-page mechanic used by every view in this gallery
 * (ALL and every filtered category alike): you see one set, and a scroll/
 * trackpad gesture over the gallery pages to a completely different set —
 * current set fades out, next set fades in — rather than moving the page.
 * `e.preventDefault()` on the wheel event stops the browser's own scroll
 * from ever kicking in. Each photo keeps its own natural aspect ratio
 * (fixed column width, height whatever that implies) rather than being
 * cropped to a preset box.
 *
 * Clip carry-over: right before paging, this actually measures (via refs
 * and getBoundingClientRect) whether the last photo in each column ran
 * past the visible bottom edge. Only photos that were genuinely cut off
 * get carried over — placed at the very top of that same column on the
 * next set — instead of blindly repeating the boundary photo every time
 * whether it needed it or not.
 *
 * One physical scroll gesture = one page change, wrapping around at the
 * ends (last set → back to the first, and vice versa). A single trackpad
 * swipe fires many wheel events over its whole duration, not just one — a
 * fixed timed lock (e.g. "ignore events for 700ms") isn't reliable because
 * a slow or lingering swipe can easily outlast that and trigger a second
 * advance before the user's hand has even left the trackpad. Instead this
 * only acts on the FIRST event of a gesture, then re-arms an idle timer on
 * every subsequent event; the lock only lifts once wheel input has
 * actually stopped for a beat, however long the gesture itself took.
 *
 * With just one set (as any lightly-populated category will have), the
 * wheel handler still runs but paging wraps to itself — same feature,
 * nothing to page to yet.
 */
function PagedGallery({ sets }) {
  const columnCount = sets[0]?.length ?? 0
  const [page, setPage] = useState(0)
  const [carry, setCarry] = useState(() => Array(columnCount).fill(null))
  const lockedRef = useRef(false)
  const idleTimerRef = useRef(null)
  const containerRef = useRef(null)
  const lastItemRefs = useRef([])

  const registerLastItem = (colIndex) => (el) => {
    lastItemRefs.current[colIndex] = el
  }

  // Any photo whose carried-over item, if present, gets stitched onto the
  // front of that column before rendering.
  const displayedColumns = sets[page].map((column, i) => (carry[i] ? [carry[i], ...column] : column))

  const goToPage = (direction) => {
    const containerBottom = containerRef.current?.getBoundingClientRect().bottom
    const nextCarry = displayedColumns.map((column, i) => {
      const el = lastItemRefs.current[i]
      if (!el || !containerBottom || column.length === 0) return null
      const clipped = el.getBoundingClientRect().bottom > containerBottom + 1
      return clipped ? column[column.length - 1] : null
    })
    setCarry(nextCarry)
    setPage((current) => (current + direction + sets.length) % sets.length)
  }

  const handleWheel = (e) => {
    e.preventDefault()

    // Any wheel activity pushes the "gesture is still happening" window
    // back out, regardless of whether this event caused a page change.
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      lockedRef.current = false
    }, 400)

    if (lockedRef.current) return
    const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
    if (direction === 0) return
    lockedRef.current = true
    goToPage(direction)
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        position: 'relative',
        flex: '1 1 auto',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <GalleryPage key={page} columns={displayedColumns} registerLastItem={registerLastItem} />
      </AnimatePresence>
    </div>
  )
}

// Splits a flat list of photo items into masonry "sets" for PagedGallery —
// each set is `columns` columns of up to `perColumn` photos, round-robin,
// the same density the hand-arranged ALL sets use. A category with more
// photos than one set holds naturally spills into a second (third, ...)
// set, paged the same way as ALL. (Clip carry-over between sets happens at
// render time in PagedGallery, not here.)
function chunkIntoSets(items, { columns = 5, perColumn = 2 } = {}) {
  const perSet = columns * perColumn
  const sets = []
  for (let start = 0; start < items.length; start += perSet) {
    const chunk = items.slice(start, start + perSet)
    const cols = Array.from({ length: columns }, () => [])
    chunk.forEach((item, i) => cols[i % columns].push(item))
    sets.push(cols)
  }
  return sets.length > 0 ? sets : [Array.from({ length: columns }, () => [])]
}

/**
 * The default ("all") view — every real photo across every category
 * (Friends, Skies & Nature, Concerts, Volleyball) plus the leftovers, the
 * caption, and the three real "widget" cards (currently-on-repeat song,
 * current fixations, location — see WhoWidgets.jsx), all interleaved and
 * auto-chunked into scroll-to-page sets by chunkIntoSets. Paged via
 * PagedGallery above — grows automatically as more photos land in any of
 * the category folders, no manual re-authoring needed.
 */
function AllPhotosView() {
  const sets = chunkIntoSets(ALL_ITEMS)
  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, marginTop: rpx(32), display: 'flex' }}>
      <PagedGallery sets={sets} />
    </div>
  )
}

/**
 * A single filtered category view (Friends, Skies & Nature, Volleyball) —
 * a line of context about what the category means, then the same
 * scroll-to-page masonry as the ALL view, just built from only that
 * category's photos (chunked into same-density sets by chunkIntoSets).
 */
function CategoryView({ category }) {
  const photos = CATEGORY_PHOTOS[category] ?? []
  const sets = chunkIntoSets(photos)

  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, marginTop: rpx(32), display: 'flex', flexDirection: 'column' }}>
      <p
        style={{
          margin: `0 0 ${rpx(20)} 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(16),
          lineHeight: 1.4,
          color: 'rgba(0, 0, 0, 0.6)',
          maxWidth: rpx(700),
          flexShrink: 0,
        }}
      >
        {CATEGORY_CONTEXT[category]}
      </p>

      {photos.length === 0 ? (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(14), color: 'rgba(0, 0, 0, 0.4)' }}>
          Photos coming soon.
        </p>
      ) : (
        <PagedGallery sets={sets} />
      )}
    </div>
  )
}

export default function WhoGallery({ category = 'all' }) {
  if (category === 'all') return <AllPhotosView />
  return <CategoryView key={category} category={category} />
}
