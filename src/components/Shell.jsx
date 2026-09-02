import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ExpandedHeader from './ExpandedHeader.jsx'
import PlaygroundRail from './PlaygroundRail.jsx'
import BottomStepper from './BottomStepper.jsx'
import MobileNav from './MobileNav.jsx'
import ResumeLink from './ResumeLink.jsx'
import ContactLink from './ContactLink.jsx'
import CustomCursor from './CustomCursor.jsx'
import HeroContent from '../pages/Landing/HeroContent.jsx'
import HomeMobile from '../pages/Landing/HomeMobile.jsx'
import WhoContent from '../pages/WHO/WhoContent.jsx'
import WhoFilters from '../pages/WHO/WhoFilters.jsx'
import WhoMobile from '../pages/WHO/WhoMobile.jsx'
import WorkContent from '../pages/WORK/WorkContent.jsx'
import WorkHomeContent from '../pages/WORK/WorkHomeContent.jsx'
import PlayContent from '../pages/PLAY/PlayContent.jsx'
import PlayContentMobile from '../pages/PLAY/PlayContentMobile.jsx'
import { HOME_WORK_OFFSET } from '../constants/layout.js'
import { rpx } from '../constants/responsive.js'
import { useIsMobile } from '../hooks/useIsMobile.js'

// Fixed left-to-right order of the four full-screen panels. Navigating
// slides the whole track horizontally so the target panel lines up exactly
// with the viewport — no wraparound: home and playground are the two ends
// of a straight strip, not a loop, since each section is now a literal
// side-by-side panel rather than a column that widens/narrows in place.
const SECTIONS = ['home', 'work', 'who', 'play']
const PATH_FOR_SECTION = { home: '/', work: '/work', who: '/who', play: '/play' }
const N = SECTIONS.length

// Same idea as SECTIONS above, minus WORK — MobileNav's menu (mobile only)
// doesn't link to the WORK grid at all, since HomeMobile now lists every
// case study directly rather than sending people to a separate page for
// it (see the note on FEATURED_PROJECTS in HomeMobile.jsx). SECTIONS
// itself stays untouched — it still drives arrow-key stepping and the
// desktop BottomStepper, both of which are unrelated to this.
const MOBILE_NAV_SECTIONS = SECTIONS.filter((section) => section !== 'work')

// Scrapped the 3D page-turn — a rotateY flip is inherently fragile (leans
// on perspective, transform-origin, and timing all agreeing with each
// other) and it read as glitchy/tacky in practice, not worth the risk for
// a section transition. This is a plain, clean crossfade with a small
// directional nudge (24px) instead: the outgoing panel fades out while
// nudging slightly the way it "came from," the incoming panel fades in
// while settling into place from a slight offset in the direction of
// travel. No 3D, no perspective, nothing that can render inconsistently —
// just opacity + a small translateX, so it can't glitch.
//
// `custom` is the direction (1 = moving forward through SECTIONS, -1 =
// backward), computed below from whichever index the URL was on right
// before this change, so it works the same whether the nav came from
// jumpTo(), the arrow keys, or the browser's own back/forward buttons.
const PANEL_VARIANTS = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
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
  const location = useLocation()
  const isMobile = useIsMobile()

  // Null while viewing a case study (a /work/:projectId sub-path) rather
  // than the WORK grid itself — passed to BottomStepper as `activeLabel`
  // so WORK's underline turns off there (see BottomStepper.jsx), even
  // though `active` itself stays 'work' the whole time for the flip-panel
  // logic below.
  const isCaseStudyPage = active === 'work' && Boolean(location.pathname.split('/')[2])
  const navActiveLabel = isCaseStudyPage ? null : active

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

  // Once the transition settles at x:0, explicitly clear the panel's
  // `transform` back to a real `none` instead of leaving Framer Motion's
  // `translateX(0px)` sitting on it. Even at a pure identity translation,
  // ANY non-`none` transform value makes that element the containing block
  // for every position:absolute descendant (the WORK case-study list,
  // HeroContent's name/tagline, etc.) and, it turns out, can also stop a
  // nested overflow:auto region from responding to trackpad scroll in some
  // browsers — which is what made landing on WORK via a transition from
  // another panel leave the grid stuck (a hard refresh straight to /work
  // skips the transition entirely, so it was never affected).
  //
  // This used to live in a separate effect that read the node back off a
  // shared `panelRef` on a delay — but AnimatePresence's default "sync"
  // mode keeps the exiting panel mounted (with that same ref) right
  // alongside the freshly-entered one for the whole transition, and
  // whichever one committed its ref last won, so the timeout could end up
  // clearing the transform on the panel about to be removed instead of
  // the one actually on screen. Doing it here in the callback ref instead
  // closes over the specific DOM node for THIS mount only — nothing
  // shared, nothing to race. The old node's own timer (from its own
  // mount) firing after it's already been removed is harmless.
  const setPanelRef = useCallback((node) => {
    if (!node) return
    setTimeout(() => {
      node.style.transform = 'none'
    }, 700)
  }, [])

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

  // Same idea as goTo, but for landing directly on one specific case study
  // instead of the WORK grid — a real /work/:projectId route (read by
  // WorkContent.jsx straight off the URL) rather than router state layered
  // on top of the plain /work path. That's what makes a case study
  // genuinely its own page: it has its own distinct URL, so plain "go to
  // /work" (the WORK nav item, back button, etc.) always lands on the grid
  // with no leftover state to clear, and the browser's own back/forward
  // buttons and bookmarking/sharing a case-study link work natively too.
  // Used by the home page's video box (see WorkHomeContent usage below) so
  // clicking Ophelia opens straight into that case study instead of
  // dropping onto the grid first.
  const goToProject = (projectId) => (e) => {
    e.stopPropagation()
    navigate(`/work/${projectId}`)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* Exactly one panel mounted at a time — whichever matches `active` —
          swapped via AnimatePresence using PANEL_VARIANTS above. Replaces
          the old wide sliding track; each panel keeps the same internal
          layout it always had, just moved from being one of 4 side-by-side
          flex children to being the sole absolutely-positioned child here. */}
      <AnimatePresence custom={direction}>
        <motion.div
          ref={setPanelRef}
          key={active}
          custom={direction}
          variants={PANEL_VARIANTS}
          initial={isFirstRenderRef.current ? false : 'enter'}
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          {active === 'home' && isMobile && (
            /* HOME panel — mobile. A real single-column, scrolling layout
                (see HomeMobile.jsx) instead of the desktop's fixed 100vh
                absolute-positioned overlay + asymmetric grid, which has no
                room to reflow at phone widths. Nav lives in MobileNav's
                fixed top-right button now (not a bottom bar), so this only
                needs a small bottom gutter, not clearance for anything
                fixed. */
            <div style={{ position: 'relative', width: '100vw', height: '100%', overflow: 'hidden auto', paddingBottom: '24px' }}>
              <HomeMobile
                onWho={() => jumpTo('who')}
                onOphelia={goToProject('ophelia-ai-canvas')}
                onLiveRegi={goToProject('regi-internal-tool')}
                onBitesize={goToProject('bitesize')}
                onOMHS={goToProject('oakville-milton-humane-society')}
              />
            </div>
          )}

          {active === 'home' && !isMobile && (
            /* HOME panel — desktop */
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
                <WorkHomeContent
                  onNavigate={goTo('/work')}
                  onNavigateToOphelia={goToProject('ophelia-ai-canvas')}
                  onNavigateToLiveRegi={goToProject('regi-internal-tool')}
                  onNavigateToOMHS={goToProject('oakville-milton-humane-society')}
                />
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
              {/* Hidden on mobile while viewing a specific case study (see
                  isCaseStudyPage above) — the mobile case study layouts
                  (e.g. OpheliaCaseStudyMobile.jsx) supply their own top
                  padding to clear MobileNav's button and their own "←
                  Back" link, the same way HomeMobile/WhoMobile skip
                  ExpandedHeader entirely. A plain "WORK" label above a
                  page that isn't the WORK grid, on top of MobileNav's own
                  menu, would just be redundant chrome eating vertical
                  space on a phone. */}
              {!(isMobile && isCaseStudyPage) && <ExpandedHeader label="WORK" />}
              {/* Safety-net overflow here too, in addition to WorkContent's
                  own internal overflowY — if this wrapper's height:100%
                  pass-through into WorkContent ever fails to resolve to a
                  definite size for any reason (trackpad scroll got reported
                  stuck once the grid grew past one screen), this outer
                  boundary still has a real flex-resolved height of its own
                  and catches the overflow directly instead of leaving
                  nothing able to scroll. Harmless when the inner one is
                  already working — only one of the two ever actually shows
                  a scrollbar. */}
              <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
                <WorkContent />
              </div>
            </div>
          )}

          {active === 'who' && isMobile && (
            /* WHO panel — mobile. One normal scrolling page (see
                WhoMobile.jsx: text snippet → filters → photos, all in
                document flow) instead of the desktop's fixed-height split
                (ExpandedHeader + two independently-scrolling columns) —
                no room for a second column on a phone anyway. No
                ExpandedHeader either, matching HomeMobile's approach:
                MobileNav's menu already provides wayfinding, so a
                redundant "WHO" label up top isn't needed. */
            <div style={{ position: 'relative', width: '100vw', height: '100%', overflow: 'hidden auto', paddingBottom: '24px' }}>
              <WhoMobile category={whoCategory} onCategoryChange={setWhoCategory} />
            </div>
          )}

          {active === 'who' && !isMobile && (
            /* WHO panel — desktop. A flex column (rather than plain
                stacked children like the other panels) so ExpandedHeader
                keeps its natural height and WhoContent gets exactly
                whatever's left via flex: 1. That's what lets WhoContent's
                own height: 100% mean something real, which its two
                columns (bio text, photo gallery) both rely on to scroll
                independently within their own bounds — see
                WhoContent.jsx. overflow stays hidden here at the outer
                level since neither column should ever push the panel
                itself past the viewport; each one scrolls internally
                instead. */
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

          {active === 'play' && isMobile && (
            /* PLAYGROUND panel — mobile. A 2-column bento masonry (see
                PlayContentMobile.jsx) instead of the desktop's hand-split
                left/right layout, which needs the full-width blurb column
                a phone doesn't have room for. No ExpandedHeader, matching
                Home/WHO's mobile approach — MobileNav's menu already
                covers wayfinding. */
            <div style={{ position: 'relative', width: '100vw', height: '100%', overflow: 'hidden auto', paddingBottom: '24px' }}>
              <PlayContentMobile />
            </div>
          )}

          {active === 'play' && !isMobile && (
            /* PLAYGROUND panel — desktop. Same paddingBottom fix as WORK,
                so the last row of pieces in the gallery list clears the
                bottom edge instead of stopping right underneath it. */
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

      {/* Persistent chrome across every panel. On mobile the three separate
          fixed corner pieces below (Resume bottom-left, Contact
          bottom-right, BottomStepper's nav pill bottom-center) have no
          room to coexist without overlapping — and shouldn't just be the
          same bottom-pill treatment moved around anyway — so MobileNav
          replaces all three with a single top-right menu button instead.
          See MobileNav.jsx. */}
      {isMobile ? (
        <MobileNav active={active} activeLabel={navActiveLabel} sections={MOBILE_NAV_SECTIONS} onSelect={jumpTo} />
      ) : (
        <>
          {/* Resume — fixed to the bottom-left corner across every panel. */}
          <ResumeLink active={active} />

          {/* Contact — the mirror image on the bottom-right, same treatment. */}
          <ContactLink active={active} />

          {/* Bottom nav — small dots (per the sketch) that grow and reveal a
              label on hover; clicking one jumps straight to that section
              rather than stepping through the panels in between. */}
          <BottomStepper active={active} activeLabel={navActiveLabel} sections={SECTIONS} onSelect={jumpTo} />
        </>
      )}

      {/* Custom cursor — mounted once here (not per-panel) so it persists
          across every page instead of remounting/flickering on
          navigation. See CustomCursor.jsx; the system cursor is hidden
          globally in index.css. */}
      <CustomCursor />
    </div>
  )
}
