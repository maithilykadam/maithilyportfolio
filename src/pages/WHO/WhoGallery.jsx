import { rpx } from '../../constants/responsive.js'
import { MusicCard } from './WhoWidgets.jsx'

const WIDGETS = {
  music: MusicCard,
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
// public/who/ is also split into per-category subfolders (skies-nature/,
// concerts/, volleyball/) so the filter pills in
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
  'skies-nature': SKIES_PHOTOS,
  concerts: CONCERTS_PHOTOS,
  volleyball: VOLLEYBALL_PHOTOS,
}

// A line of context for each category — shown above the filtered photo
// grid so a category reads as more than just a photo dump.
const CATEGORY_CONTEXT = {
  'skies-nature': 'Sunsets, skylines, and the outdoors, where I go to slow down and reset.',
  concerts: 'Live music, from stadium shows to festival stages, some of my favourite nights out.',
  volleyball:
    'Volleyball is such an important part of my life, and it has taught me so much about myself and how to navigate the world.',
}

// Same idea as CATEGORY_CONTEXT above, but for the default ("all") view —
// shown above the full mixed feed so it reads as one intentional set
// rather than an unlabeled dump of every category at once.
const ALL_CONTEXT = 'A bit of everything, all mixed together: concerts, sunsets, volleyball, and the moments in between.'

// A handful of real photos that were never sorted into one of the three
// categories above (still just sitting at the folder root).
const UNCATEGORIZED_PHOTOS = ['IMG_0316', 'IMG_1480', 'IMG_5158', 'IMG_5253', 'IMG_5633'].map((name) => ({
  src: PHOTO(name),
}))

// Round-robins across several photo lists at once — one from each group per
// pass — so ALL isn't "every skies photo, then every concert photo, then
// every volleyball photo, ...", it's a genuine mix of everything throughout.
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

// The one widget card (currently-on-repeat song — see WhoWidgets.jsx)
// spread into the interleaved photo list below, rather than clustered at
// the very start, so ALL still has that personal-Pinterest-board mix of
// photos and "cards" throughout, not just in set one.
const ALL_SPECIAL_ITEMS = [{ widget: 'music' }]

function withSpecialItemsSpread(photos, specials) {
  const result = [...photos]
  const step = Math.floor(result.length / (specials.length + 1))
  specials.forEach((item, i) => {
    result.splice(step * (i + 1) + i, 0, item)
  })
  return result
}

// Every real photo across every category, plus the leftovers, interleaved
// and with the widget card spread through — this is the full "everything"
// list, rendered by ScrollingGallery below — so it automatically grows as
// more photos get added to any folder.
const ALL_ITEMS = withSpecialItemsSpread(
  interleave([SKIES_PHOTOS, CONCERTS_PHOTOS, VOLLEYBALL_PHOTOS, UNCATEGORIZED_PHOTOS]),
  ALL_SPECIAL_ITEMS,
)

function GalleryItem({ item }) {
  if (item.caption) return <Caption text={item.caption} />
  if (item.widget) return <Widget kind={item.widget} />
  return <Photo src={item.src} />
}

/**
 * A plain, continuously-scrolling masonry — replaces the old PagedGallery
 * (a wheel gesture swapping in a whole new hand-chunked set, no real
 * scrollbar, with clip-detection logic to carry cut-off photos over to the
 * next set). That made sense when the gallery was the entire panel; now
 * that it shares the row with the bio column (see WhoContent.jsx) and has
 * less width to work with, a real vertical scroll reads better than a "one
 * gesture = one whole new set" swap.
 *
 * Two false starts before landing here:
 *   1. CSS multi-column (`columnCount`) with the scroll-bounding
 *      (`position: absolute; inset: 0`) on the SAME element as the
 *      columns. That was the actual mistake, not multi-column itself —
 *      capping an element's height while also asking it to lay out N
 *      columns forces the spec's overflow behavior to kick in: instead of
 *      making the columns taller, it adds MORE columns further to the
 *      right, which `overflowX: hidden` was then silently clipping.
 *      Photos were disappearing with nothing to scroll.
 *   2. Manually round-robining items into a fixed number of real flexbox
 *      columns (item i into column i % 3) to sidestep that. Fixed the
 *      scrolling, but round-robin-by-count doesn't know anything about
 *      each photo's actual height, so a column that happened to land a
 *      run of short/landscape photos finished far short of its
 *      neighbors — a big blank gap at its bottom for the rest of the
 *      scroll. Swapping that for a plain CSS grid (row-major fill) traded
 *      one big gap for a smaller version of the same problem in every
 *      single row instead — still not a real masonry.
 *
 * The fix is CSS multi-column after all — `columnCount` is what actually
 * balances column heights evenly (real masonry) and grows the container to
 * fit, but ONLY when its own height is left unconstrained. So the two
 * concerns are now on two different elements: an outer wrapper owns the
 * scroll bounding (`position: absolute; inset: 0`, `overflowY: auto`), and
 * the inner element owns the columns with no height set on it at all —
 * free to grow as tall as it needs so the browser can balance it properly,
 * while the outer wrapper scrolls through that.
 */
function ScrollingGallery({ items, columns = 3 }) {
  return (
    <div data-cursor-hover="scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ columnCount: columns, columnGap: rpx(16) }}>
        {items.map((item, i) => (
          <div key={i} style={{ breakInside: 'avoid', marginBottom: rpx(16) }}>
            <GalleryItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The default ("all") view — every real photo across every category
 * (Skies & Nature, Concerts, Volleyball) plus the leftovers, and the real
 * "widget" card (currently-on-repeat song — see WhoWidgets.jsx), all
 * interleaved and
 * scrolling continuously via ScrollingGallery — grows automatically as more
 * photos land in any of the category folders, no manual re-authoring
 * needed.
 */
function AllPhotosView() {
  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <p
        style={{
          margin: `0 0 ${rpx(20)} 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(16),
          lineHeight: 1.4,
          color: 'rgba(0, 0, 0, 0.6)',
          flexShrink: 0,
        }}
      >
        {ALL_CONTEXT}
      </p>

      <div style={{ flex: '1 1 auto', minHeight: 0, position: 'relative' }}>
        <ScrollingGallery items={ALL_ITEMS} />
      </div>
    </div>
  )
}

/**
 * A single filtered category view (Skies & Nature, Concerts, Volleyball) —
 * a line of context about what the category means, then the same
 * continuously-scrolling masonry as the ALL view, just built from only
 * that category's photos.
 */
function CategoryView({ category }) {
  const photos = CATEGORY_PHOTOS[category] ?? []

  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <p
        style={{
          margin: `0 0 ${rpx(20)} 0`,
          fontFamily: 'var(--font-sans)',
          fontSize: rpx(16),
          lineHeight: 1.4,
          color: 'rgba(0, 0, 0, 0.6)',
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
        <div style={{ flex: '1 1 auto', minHeight: 0, position: 'relative' }}>
          <ScrollingGallery items={photos} />
        </div>
      )}
    </div>
  )
}

export default function WhoGallery({ category = 'all' }) {
  if (category === 'all') return <AllPhotosView />
  return <CategoryView key={category} category={category} />
}
