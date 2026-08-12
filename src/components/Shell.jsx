import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ExpandedHeader from './ExpandedHeader.jsx'
import PlaygroundRail from './PlaygroundRail.jsx'
import BottomStepper from './BottomStepper.jsx'
import ResumeLink from './ResumeLink.jsx'
import CustomCursor from './CustomCursor.jsx'
import HeroContent from '../pages/Landing/HeroContent.jsx'
import WhoContent from '../pages/WHO/WhoContent.jsx'
import WhoFilters from '../pages/WHO/WhoFilters.jsx'
import WorkContent from '../pages/WORK/WorkContent.jsx'
import WorkHomeContent from '../pages/WORK/WorkHomeContent.jsx'
import PlayContent from '../pages/PLAY/PlayContent.jsx'
import { HOME_WORK_OFFSET } from '../constants/layout.js'
import { rpx } from '../constants/responsive.js'

// Fixed left-to-right order of the four full-screen panels. Navigating
// slides the whole track horizontally so the target panel lines up exactly
// with the viewport — no wraparound: home and playground are the two ends
// of a straight strip, not a loop, since each section is now a literal
// side-by-side panel rather than a column that widens/narrows in place.
const SECTIONS = ['home', 'work', 'who', 'play']
const PATH_FOR_SECTION = { home: '/', work: '/work', who: '/who', play: '/play' }
const N = SECTIONS.length

// A 3D "page turn" instead of the old literal panel-slide: the outgoing
// panel tilts away on its Y axis while fading, the incoming one tilts in
// from the opposite side while fading up to full opacity. Pushed to a
// real, felt turn (65°, plus a tighter 1000px perspective so the rotation
// has actual foreshortening) rather than the first pass's 18°, which read
// as barely-there. Still stops short of a full 90° edge-on book-page swing
// and there's no paper texture/curl, so it stays closer to "the spread
// tilting" than a skeuomorphic page-flip widget.
//
// `custom` is the direction (1 = moving forward through SECTIONS, -1 =
// backward), computed below from whichever index the URL was on right
// before this change, so it works the same whether the nav came from
// jumpTo(), the arrow keys, or the browser's own back/forward buttons.
const FLIP_VARIANTS = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 65 : -65,
    opacity: 0,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    rotateY: direction > 0 ? -65 : 65,
    opacity: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

// One persistent shell mounted for the whole app. Four full-viewport panels
// (home/work/who/playground) are rendered one at a time — whichever one
// matches `active` — swapped via AnimatePresence using the flip variants
// above instead of the old wide sliding track.
//
// Navigation happens through `jumpTo()` below: the left/right (or up/down)
// arrow keys, the bottom nav (BottomStepper.jsx), or the collapsed
// PLAYGROUND rail on the home panel. All of them just call `navigate()`;
// the actual transition is driven entirely by `active` changing and
// AnimatePresence reacting to the swapped `key`, so it looks identical no
// matter what triggered the navigation (including the browser's own
// back/forward buttons). Deliberately NOT wired to scroll/swipe —
// horizontal trackpad gestures risk colliding with the browser's own
// back/forward swipe gesture, so arrow keys + an explicit on-screen
// control are used instead: no gesture to misinterpret.
export default function Shell({ active }) {
  const navigate = useNavigate()

  // Which WHO photo category is active ("all" by default) — lifted up here
  // because the filter pills live in the header (a sibling of WhoContent),
  // not inside WhoContent itself, so both need access to the same state.
  const [whoCategory, setWhoCategory] = useState('all')

  // Which way we just moved through SECTIONS (1 forward, -1 backward) —
  // feeds the flip variants above so the turn leans the correct direction.
  // Recomputed from whichever index `active` used to be on, so it stays
  // correct regardless of what triggered the navigation.
  const [direction, setDirection] = useState(1)
  const prevIndexRef = useRef(SECTIONS.indexOf(active))

  useEffect(() => {
    const newIndex = SECTIONS.indexOf(active)
    if (newIndex === -1) return
    const prevIndex = prevIndexRef.current
    if (newIndex !== prevIndex) {
      setDirection(newIndex > prevIndex ? 1 : -1)
      prevIndexRef.current = newIndex
    }
  }, [active])

  // The flipping panel — ref points at whichever panel DOM node is
  // currently mounted (a fresh node each time `active` changes, since
  // AnimatePresence keys on it).
  const panelRef = useRef(null)

  // True only for the very first render of the whole app (whichever route
  // it happened to load on), flipped false right after. Used below so the
  // very first panel skips its own flip-in (there's nothing to flip FROM
  // on a cold load) without touching AnimatePresence's own `initial` prop
  // — that prop doesn't just gate the flip, it also suppresses `initial`
  // vs. `animate` for every nested motion component in the tree (not just
  // this panel's own), which was quietly killing HeroContent's staged
  // name/caption/rest-of-page reveal (see HeroContent.jsx) specifically
  // on a hard refresh of home, while working fine every other time home
  // was reached by navigating there client-side (a genuine new mount,
  // past AnimatePresence's "first render" window). Gating it here instead
  // keeps the "skip the flip on cold load" behavior local to the flip
  // itself.
  const isFirstRenderRef = useRef(true)
  useEffect(() => {
    isFirstRenderRef.current = false
  }, [])

  // Once the flip settles at rotateY(0), explicitly clear the element's
  // `transform` back to a real `none` instead of leaving Framer Motion's
  // `perspective(1000px) rotateY(0deg)` sitting on it. Even at a pure
  // identity rotation, ANY non-`none` transform value makes that element
  // the containing block for every position:absolute descendant — which
  // includes the WORK case-study list, HeroContent's name/tagline, etc.
  // That new containing block combined with the hero name's intentional
  // spill-over into the case-study column (see HeroContent.jsx) was
  // silently swallowing hover/click on the first case study in Safari,
  // which handles pointer-events: none differently inside a transformed
  // ancestor. Clearing the transform once the turn is done — well after
  // the 0.65s "center" tween finishes — restores the exact pre-flip
  // behavior during the (much more common) idle/settled state; the very
  // next transition simply re-drives `transform` itself and overrides
  // this, so the flip's visual is untouched.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (panelRef.current) panelRef.current.style.transform = 'none'
    }, 700)
    return () => clearTimeout(timer)
  }, [active])

  // Every kind of navigation funnels through here — just updates the
  // route; the flip transition itself is driven by `active` changing.
  const jumpTo = (targetSection) => {
    if (!PATH_FOR_SECTION[targetSection]) return
    navigate(PATH_FOR_SECTION[targetSection])
  }

  // Moves exactly one panel forward (+1) or backward (-1), clamped to the
  // two ends of the strip rather than wrapping — what the arrow keys call.
  const step = (direction) => {
    const currentIndex = SECTIONS.indexOf(active)
    if (currentIndex === -1) return
    const targetIndex = Math.min(N - 1, Math.max(0, currentIndex + direction))
    if (targetIndex === currentIndex) return
    jumpTo(SECTIONS[targetIndex])
  }

  // Left/right (or up/down) arrow keys step one panel at a time. A brief
  // lock prevents holding a key down from rapid-firing through several
  // panels faster than the transition can actually play.
  const keyLockedRef = useRef(false)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction =
        e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (direction === 0 || keyLockedRef.current) return
      keyLockedRef.current = true
      step(direction)
      setTimeout(() => {
        keyLockedRef.current = false
      }, 700)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // Still used by the WORK case-study rows (list content, not a section
  // title) so clicking one jumps straight to the WORK panel.
  const goTo = (path) => (e) => {
    e.stopPropagation()
    const targetSection = Object.keys(PATH_FOR_SECTION).find((key) => PATH_FOR_SECTION[key] === path)
    if (targetSection) jumpTo(targetSection)
    else navigate(path)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        perspective: 1000,
      }}
    >
      {/* Exactly one panel mounted at a time — whichever matches `active` —
          swapped via AnimatePresence using FLIP_VARIANTS above. Replaces
          the old wide sliding track; each panel keeps the same internal
          layout it always had, just moved from being one of 4 side-by-side
          flex children to being the sole absolutely-positioned child here. */}
      <AnimatePresence custom={direction}>
        <motion.div
          ref={panelRef}
          key={active}
          custom={direction}
          variants={FLIP_VARIANTS}
          initial={isFirstRenderRef.current ? false : 'enter'}
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
            transformPerspective: 1000,
          }}
        >
          {active === 'home' && (
            /* HOME panel */
            <div style={{ position: 'relative', width: '100vw', height: '100%', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <HeroContent onWhoClick={() => jumpTo('who')} />
              </div>
              {/* WORK placeholder boxes — offset from the panel's left edge
                  to sit where the old WORK column used to start, so the
                  home page still reads the same even though it's one
                  full-width panel now instead of separate flex columns. */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: rpx(HOME_WORK_OFFSET),
                  height: '100%',
                  width: `calc(100vw - ${rpx(HOME_WORK_OFFSET)})`,
                }}
              >
                <WorkHomeContent onNavigate={goTo('/work')} />
              </div>

              {/* Collapsed PLAYGROUND rail — home page only, per the "keep
                  Work/Who exactly as they are, just bring this back" request.
                  A thin clickable strip, not a hover-expand: jumps straight to
                  the full Playground panel via the same jumpTo() the bottom
                  nav pill uses. */}
              <PlaygroundRail onClick={() => jumpTo('play')} />
            </div>
          )}

          {active === 'work' && (
            /* WORK panel — same non-scrolling flex-column pattern as WHO
                below: ExpandedHeader keeps its natural height, WorkContent
                gets exactly whatever's left via flex: 1, and the
                placeholder grid inside it fills that space completely
                (see WorkContent.jsx) instead of being sized by content and
                overflowing into a scrollbar. */
            <div
              style={{
                position: 'relative',
                width: '100vw',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ExpandedHeader label="WORK" />
              <div style={{ flex: '1 1 auto', minHeight: 0 }}>
                <WorkContent />
              </div>
            </div>
          )}

          {active === 'who' && (
            /* WHO panel — a flex column (rather than plain stacked children
                like the other panels) so ExpandedHeader keeps its natural
                height and WhoContent gets exactly whatever's left via flex: 1.
                That's what lets WhoContent's own height: 100% mean something
                real, which is how the gallery inside it can fill the rest of
                the screen with no scrollbar. overflow stays hidden (not auto)
                since the gallery is deliberately never meant to scroll. */
            <div
              style={{
                position: 'relative',
                width: '100vw',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ExpandedHeader label="WHO" right={<WhoFilters value={whoCategory} onChange={setWhoCategory} />} />
              <div style={{ flex: '1 1 auto', minHeight: 0 }}>
                <WhoContent category={whoCategory} />
              </div>
            </div>
          )}

          {active === 'play' && (
            /* PLAYGROUND panel — same paddingBottom fix as WORK, so the last
                row of pieces in the gallery list clears the bottom edge
                instead of stopping right underneath it. */
            <div
              style={{
                position: 'relative',
                width: '100vw',
                height: '100%',
                overflow: 'hidden auto',
                paddingBottom: rpx(120),
              }}
            >
              <ExpandedHeader label="PLAYGROUND" />
              <PlayContent />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Resume — fixed to the bottom-left corner across every panel. */}
      <ResumeLink active={active} />

      {/* Bottom nav — small dots (per the sketch) that grow and reveal a
          label on hover; clicking one jumps straight to that section
          rather than stepping through the panels in between. */}
      <BottomStepper active={active} sections={SECTIONS} onSelect={jumpTo} />

      {/* Custom cursor — mounted once here (not per-panel) so it persists
          across every page instead of remounting/flickering on
          navigation. See CustomCursor.jsx; the system cursor is hidden
          globally in index.css. */}
      <CustomCursor />
    </div>
  )
}
