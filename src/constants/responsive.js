// Everything in this app was designed against a 1440px-wide frame in
// Figma. On any screen at or above 1440px, values should look exactly as
// designed. Below that (e.g. a 13" MacBook Air, which is often narrower
// than 1440 CSS px), every font size, padding, and absolute position
// should shrink in the same proportion — otherwise the design only looks
// "correct" at one specific width and looks oversized everywhere narrower.
//
// rpx(170) => "min(170px, 11.8vw)" — i.e. 170px on anything 1440px or
// wider, and scales down 1:1 with viewport width below that. No JS/resize
// listeners needed; it's pure CSS.
//
// For negative values (the "expand the hover/click area" margin trick,
// e.g. rpx(-14)) the comparison has to flip: -14px is *smaller* than a
// scaled-down -6px, so min() would always pick -14px and never scale.
// max() picks the one closer to zero when narrow, and clamps to -14px at
// design width and above — the mirror image of the positive case.
const DESIGN_WIDTH = 1440

export function rpx(px) {
  const vw = (px / DESIGN_WIDTH) * 100
  return px < 0 ? `max(${px}px, ${vw}vw)` : `min(${px}px, ${vw}vw)`
}
