// One shared easing/duration so panel-slide transitions all feel like the
// same physical motion, no matter which nav control triggered them (bottom
// pill, arrow keys, browser back/forward).
export const SLIDE_TRANSITION = {
  duration: 0.6,
  ease: [0.65, 0, 0.35, 1],
}

// How far the home panel's WORK case-study list sits from the panel's own
// left edge — matches where the old WORK column used to start (right after
// the old WHO column's 400px-at-1440-design width), so the home page's
// layout doesn't visually shift now that it's one full-width panel instead
// of separate flex columns.
export const HOME_WORK_OFFSET = 400

// The floating case-study preview panel on the home page — a full-height
// vertical strip flush against the right edge of the viewport (see
// ProjectPreview.jsx). Only `width` lives here (508px at the 1440px
// reference, same convention as rpx() everywhere else).
export const PREVIEW_BOX = {
  width: 508,
}

// Width of the collapsed "PLAYGROUND" peek rail flush against the home
// panel's right edge (see PlaygroundRail.jsx) — a thin strip you click to
// jump to the full Playground panel, home-page only. ProjectPreview and
// the WORK case-study list both shift left by this amount so nothing sits
// underneath it.
export const PLAYGROUND_RAIL_WIDTH = 64
