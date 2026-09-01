import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { rpx } from '../../constants/responsive.js'

// Same accent used across every other case study's active nav item and the
// custom cursor's case-study hover state, so it reads as the same site-wide
// system rather than a one-off.
const NAVY = '#1e3a8a'
const HAIRLINE = '1px solid rgba(0, 0, 0, 0.1)'
// Sampled straight from the product's own "Add Pet"/"Invite User" primary
// button (rgb(30, 155, 217)) rather than guessed — same idea as every other
// case study's own SCREEN_MAT tying a background color back to the actual
// product instead of being arbitrary.
const SCREEN_MAT = 'rgba(30, 155, 217, 0.08)'
// Raw px (not run through rpx() itself) so ProcessGallery's scroll layout
// can multiply it by each image's real aspect ratio to get that image's
// rendered width — rpx() returns a CSS min()/vw string, not a number, so
// the multiplication has to happen on the plain number first.
const PROCESS_SCROLL_HEIGHT = 290

const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px 0px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

const METADATA = [
  { label: 'Role', value: 'Product Designer' },
  { label: 'Platform', value: 'Web app (desktop + mobile browser)' },
  { label: 'Timeline', value: '12 months (May 2024 – Apr 2025)' },
  { label: 'Team', value: ['4 designers', '2 PMs', '6 developers'] },
]

// Research and planning artifacts from public/home/humanesociety/brainstorming,
// shown ahead of the final screens so the flows below read as the answer to
// this thinking rather than screens that appeared out of nowhere. 'row' lays
// items side by side (used for the two personas); 'stack' lays them full
// width, one under another (used everywhere else, since the flow diagrams
// and sketch sheets need the room to stay legible).
const PROCESS_GROUPS = [
  {
    heading: 'Personas',
    layout: 'row',
    items: [
      {
        src: '/home/humanesociety/brainstorming/persona-philip-volunteer.png',
        alt: 'Persona: Philip, a 57-year-old retired veterinarian who volunteers at the shelter',
        caption: "Philip, 57, a retired veterinarian in Toronto. Volunteering gives him a sense of purpose, but he wants clear instructions and reminders, not a system that assumes he's good with technology.",
      },
      {
        src: '/home/humanesociety/brainstorming/persona-john-admin.png',
        alt: "Persona: John, a 40-year-old administrative coordinator, the shelter's admin archetype",
        caption: "John, 40, the shelter's Administrative Coordinator for 10 years. He's managing schedules, staffing, and volunteer programs, and wants that manual coordination work to take less time.",
      },
    ],
  },
  {
    heading: 'Mapping who can do what, then the flows that came out of it',
    layout: 'scroll',
    items: [
      {
        src: '/home/humanesociety/brainstorming/role-permissions-matrix.png',
        alt: 'Early planning board mapping which screens and actions each role, Volunteer, Staff, and Admin, gets view or edit access to',
        caption: 'Scoping which screens and actions each of the three roles actually needs, view-only versus edit access, before any of it got wireframed.',
        aspectRatio: 1652 / 1558,
      },
      {
        src: '/home/humanesociety/brainstorming/user-flow-login-and-play.png',
        alt: 'User flow diagram: a volunteer or staff member logging in and starting a task with a pet',
        caption: 'Logging in and starting a task with a pet, from a volunteer or staff perspective.',
        aspectRatio: 1740 / 1462,
      },
      {
        src: '/home/humanesociety/brainstorming/user-flow-create-user.png',
        alt: "User flow diagram: an admin creating a new user, and that new user's first login",
        caption: "An admin creating a new user, paired with that new user's own path from invite email to their first login.",
        aspectRatio: 1548 / 1350,
      },
    ],
  },
  {
    heading: 'Early sketches',
    layout: 'stack',
    // One caption for the whole group instead of one per image, since these
    // two are really a single "first pass" moment — text sitting between
    // them just broke that up for no reason.
    caption: "First pass at the pet list, pet profile, login, and user profile pages, before any of it was in Figma, plus the same early pass for the admin's mobile pet list, pet profile, and interaction log history.",
    items: [
      {
        src: '/home/humanesociety/brainstorming/early-sketches-desktop.png',
        alt: 'Early hand-drawn wireframes of the pet list, pet profile, login, and user profile pages',
      },
      {
        src: '/home/humanesociety/brainstorming/early-sketches-mobile.png',
        alt: "Early hand-drawn wireframes of the admin's mobile pet list, pet profile, and interaction log history",
      },
    ],
  },
]

// Real screens from public/home/humanesociety/pet-list, .../user-management,
// and .../task-management, the organized folders so far, grouped here by
// feature (Pet List, User Management, Task Management) rather than by role —
// almost every screen in this whole case study is an admin/staff view, so
// splitting by role left "Admin Tools" doing all the work while "Volunteer
// Experience" sat nearly empty. The Interaction Log will come back as its
// own section once it has its own tablet/mobile folder too. Tablet and
// mobile shown side by side wherever both exist (see PairedFlow below), same
// as Live REGi's own paired flow.
const PET_LIST_GROUPS = [
  {
    heading: 'Browsing, filtering, and adding pets',
    pairs: [
      {
        label: 'Browsing the pet list',
        desktop: '/home/humanesociety/pet-list/tablet/tablet-pet-list.png',
        mobile: '/home/humanesociety/pet-list/mobile/mobile-admin-pet-list.png',
        note: "The tablet list groups pets as Assigned to You and Other Pets either way; on mobile, staff managing the whole shelter see it grouped by task status instead, Unassigned, Assigned, and No Tasks, since that's what they're actually triaging.",
      },
      {
        label: 'Adding a pet',
        desktop: '/home/humanesociety/pet-list/tablet/tablet-create-pet-profile-2.png',
        mobile: '/home/humanesociety/pet-list/mobile/mobile-create-pet-profile-2.png',
        note: 'A short two-step form either way, name and basic details first, then birthday and care notes, with the same confirm-before-adding modal closing it out on both platforms.',
      },
    ],
  },
]

// Admin-only: browsing, filtering, and inviting the people on the team, not
// the pets. Same tablet/mobile pairing convention as PET_LIST_GROUPS above.
const USER_MANAGEMENT_GROUPS = [
  {
    heading: 'Managing the team',
    pairs: [
      {
        label: 'Browsing the user list',
        desktop: '/home/humanesociety/user-management/tablet/tablet-user-management.png',
        mobile: '/home/humanesociety/user-management/mobile/mobile-user-management.png',
        note: "Name, role, and animal tags on tablet; mobile drops the animal tags from the list itself to keep the row scannable, they're still there on each person's own profile.",
      },
      {
        label: 'Filtering by animal tag',
        desktop: '/home/humanesociety/user-management/tablet/tablet-user-management-filtered.png',
        mobile: '/home/humanesociety/pet-list/mobile/mobile-admin-pet-list-filter.png',
        note: 'The same Animal Tag, Colour Level, Role, and Status filters as the pet list, shown here filtered down to just Cat on tablet. The mobile shot is the same filter pattern from the pet list, no separate mobile screen of the user filter panel yet, but it opens and behaves the same way.',
      },
      {
        label: 'Inviting a user',
        desktop: '/home/humanesociety/user-management/tablet/tablet-invite-user-confirm.png',
        mobile: '/home/humanesociety/user-management/mobile/mobile-invite-user-confirm.png',
        note: 'Name, contact info, role, colour level, and animal tags, same fields either way, closing with the same confirm-before-inviting modal that sends a verification link.',
      },
    ],
  },
]

// One profile screen, two very different sets of controls depending on
// whose profile it is and who's looking. The admin's edit pair is
// desktop-only for now (no mobile screen of it yet); the volunteer's own
// profile has both.
const USER_PROFILE_GROUPS = [
  {
    heading: "Viewing and managing someone's profile",
    pairs: [
      {
        label: "Viewing a user's profile",
        desktop: '/home/humanesociety/user-profile/tablet/admin/tablet-admin-user-profile.png',
        mobile: '/home/humanesociety/user-profile/mobile/admin/mobile-admin-user-profile.png',
        note: 'The full site nav plus a pencil to edit; that weekly task table is the same shape used across the pet list and task views elsewhere. Mobile splits profile info and tasks into two tabs instead of showing both at once.',
      },
      {
        label: "Editing a user's profile",
        desktop: '/home/humanesociety/user-profile/tablet/admin/tablet-admin-edit-profile.png',
        mobile: null,
        note: 'Role, colour level, and animal tags are all editable here, plus a Delete User option and a way to resend an invite to anyone who hasn\'t accepted theirs yet, none of which a volunteer gets on their own profile below. Tablet only, no mobile screen shown here.',
      },
    ],
  },
  {
    heading: "A volunteer's own profile",
    pairs: [
      {
        label: 'Your own profile',
        desktop: '/home/humanesociety/user-profile/tablet/volunteer/tablet-volunteer-profile.png',
        mobile: '/home/humanesociety/user-profile/mobile/volunteer/mobile-volunteer-profile.png',
        note: "Same Role, Colour Level, and Animal Tag info shown back to you, but there's no way to change your own role here, and Log Out replaces every admin control from the pair above.",
      },
      {
        label: 'Editing your own profile',
        desktop: '/home/humanesociety/user-profile/tablet/volunteer/tablet-volunteer-edit-profile.png',
        mobile: '/home/humanesociety/user-profile/mobile/volunteer/mobile-volunteer-edit-profile.png',
        note: "A profile picture and a Change Password option that the admin's edit view above doesn't have, in exchange for losing the role, colour level, and animal tag fields, those stay admin-only.",
      },
    ],
  },
]

// Admin-only, same as USER_MANAGEMENT_GROUPS above: the task templates every
// pet's care actually gets assigned from (Morning Walk, Feeding, Nap Time,
// and so on), organized by category (Walk, Games, Pen Time, Husbandry,
// Training, Misc.).
const TASK_MANAGEMENT_GROUPS = [
  {
    heading: 'Managing task templates',
    pairs: [
      {
        label: 'Browsing task templates',
        desktop: '/home/humanesociety/task-management/tablet/tablet-task-management.png',
        mobile: '/home/humanesociety/task-management/mobile/mobile-task-management.png',
        note: 'Name, category, and instructions on tablet; mobile drops the instructions column from the list itself, same reasoning as every other list here, the full instructions are one tap away.',
      },
      {
        label: 'Filtering by category',
        desktop: '/home/humanesociety/task-management/tablet/tablet-task-management-filtered.png',
        mobile: '/home/humanesociety/task-management/mobile/mobile-task-management-filter.png',
        note: 'Games, Husbandry, Pen Time, Training, Walk, and Misc., the same six categories either way, shown here filtered down to just Misc. on mobile and Games plus Training on tablet.',
      },
      {
        label: 'Viewing a task template',
        desktop: '/home/humanesociety/task-management/tablet/tablet-view-task-template.png',
        mobile: '/home/humanesociety/task-management/mobile/mobile-view-task-template.png',
        note: 'A modal on tablet, its own full page on mobile, same Task Name, Category, and Instructions either way, with Edit Task closing it out.',
      },
      {
        label: 'Adding a task template',
        desktop: '/home/humanesociety/task-management/tablet/tablet-add-task-template.png',
        mobile: '/home/humanesociety/task-management/mobile/mobile-add-task-template.png',
        note: 'Task name, category, and free-text instructions, same three fields either way, this is what actually gets assigned to a volunteer or staff member when a pet needs care.',
      },
    ],
  },
]

// The four decisions previously ran as a stream of paragraphs with one
// randomly singled out into a callout box — inconsistent, and just a wall
// of text. Same content, now a uniform grid of cards so all four get the
// same visual treatment instead of one standing out for no clear reason.
const DESIGN_CONSIDERATIONS = [
  {
    title: 'Skill-based assignment, not just a task list.',
    body: "Every profile carries animal tags and a colour level. Every list filters by that same tag, so a volunteer only sees tasks for animals they're actually trained for.",
  },
  {
    title: 'One system, four roles.',
    body: 'Admin, Staff, Behaviourist, and Volunteer share one tool, not four. Even a shared screen flexes per role: mobile Pet List groups by task status for staff, by Assigned to You for a volunteer.',
  },
  {
    title: 'Built for a shelter, not an office.',
    body: 'A volunteer checking a task is standing in a kennel, not at a desk. Mobile stays lightweight on purpose: your profile, your schedule, one task at a time.',
  },
  {
    title: 'An audit trail, not just a task list.',
    body: 'Animal welfare handled largely by volunteers means every role and task change gets logged with who and when, replacing the "who changed this?" guesswork from the old spreadsheet.',
  },
]

// What the project actually taught, not just what shipped — same
// icon/title/body pattern as Bitesize's own Reflection takeaways, so this
// reads as a consistent site-wide format for "here's what I learned"
// rather than a one-off for this case study.
const TAKEAWAYS = [
  {
    icon: '✓',
    title: 'A nonprofit client moves on a different clock',
    body: "No dedicated stakeholder checking in daily, just a small team already stretched thin running a shelter. Feedback came in slower, uneven bursts, so the 12-month timeline had to plan around that instead of around a typical sprint cadence.",
  },
  {
    icon: '✓',
    title: 'Permissions get complicated fast',
    body: "Four roles sounded simple until Staff needed most of Admin's access but not all of it, and Behaviourist sat somewhere in between. Mapping who can actually do what, before wireframing a single screen, saved a lot of rework later.",
  },
  {
    icon: '✓',
    title: 'Real stakes changed how carefully we shipped',
    body: "This isn't a prototype. It's what a volunteer actually checks before walking one of 19 dogs or feeding one of 30 cats. That made us slower and more careful about testing than any of the other projects here.",
  },
]

// Sidebar nav data — a flat list of clickable items, except "Flows" which
// groups the flow sections as indented children. `index` still lines up 1:1
// with each section's real position in the page (and its sectionRefs slot).
const NAV_ITEMS = [
  { label: 'Overview', index: 0 },
  { label: 'Problem', index: 1 },
  { label: 'Process', index: 2 },
  {
    label: 'Flows',
    index: 3,
    children: [
      { label: 'Pet List', index: 3 },
      { label: 'User Management', index: 4 },
      { label: 'User Profile', index: 5 },
      { label: 'Task Management', index: 6 },
    ],
  },
  { label: 'Design Considerations', index: 7 },
  { label: 'Reflection', index: 8 },
]

// Same connective-line pattern as every other case study's Transition
// component: a short line above a section, so the page reads as one
// continuous story while scrolling instead of a stack of self-contained
// blocks.
function Transition({ children }) {
  return (
    <p
      style={{
        margin: `0 0 ${rpx(10)} 0`,
        maxWidth: rpx(820),
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: rpx(34),
        lineHeight: 1.25,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </p>
  )
}

// Full-screen popout for any image on this page — every screenshot here is
// shown smaller than its native resolution, so clicking one opens it large
// instead of leaving zooming in as the only option. Click the backdrop or
// the × to close.
function Lightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: rpx(56),
            cursor: 'zoom-out',
          }}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            src={image.src}
            alt={image.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: rpx(8),
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
              cursor: 'default',
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: rpx(24),
              right: rpx(28),
              width: rpx(36),
              height: rpx(36),
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: rpx(20),
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Any clickable screenshot on this page — a plain <img> gave no signal
// that clicking did anything, so this adds a dark hover tint plus a small
// magnifying-glass badge that fades in on hover, then opens the Lightbox
// on click.
//
// `maxHeight`, when passed, caps the thumbnail at that height rather than
// forcing every image to exactly that height. A screenshot shorter than the
// cap renders at its own natural size, no stretching, no dead space; only a
// screenshot taller than the cap gets clipped at the bottom via the
// wrapper's overflow: hidden. Nothing is actually lost by that clip: the
// Lightbox this opens into always shows the complete, uncropped screenshot.
// `fixedHeight`, when passed, switches this from "fill the container's
// width, height follows" (the default, used everywhere else) to "fill a
// fixed height, width follows" — what a horizontally scrolling row needs,
// since each image there keeps its own natural aspect ratio instead of all
// stretching to match a shared container width.
function ClickableImage({ src, alt, onClick, maxHeight, fixedHeight }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'zoom-in',
        maxHeight,
        height: fixedHeight,
        overflow: maxHeight ? 'hidden' : undefined,
        display: fixedHeight ? 'inline-block' : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={
          fixedHeight
            ? { height: '100%', width: 'auto', display: 'block' }
            : { width: '100%', height: 'auto', display: 'block' }
        }
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0)',
          transition: 'background 0.15s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            width: rpx(34),
            height: rpx(34),
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={rpx(16)} height={rpx(16)} viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// A small play/pause toggle over the hero clip — same treatment as
// Bitesize's and Ophelia's own hero video, reused here now that OMHS has a
// real demo recording too instead of a static screen.
function PlayableVideo({ src, poster }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        onClick={toggle}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        style={{
          position: 'absolute',
          top: rpx(12),
          left: rpx(12),
          width: rpx(28),
          height: rpx(28),
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {playing ? (
          <span style={{ display: 'flex', gap: rpx(3) }}>
            <span style={{ width: rpx(3), height: rpx(11), background: 'white', borderRadius: rpx(1) }} />
            <span style={{ width: rpx(3), height: rpx(11), background: 'white', borderRadius: rpx(1) }} />
          </span>
        ) : (
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: `${rpx(6)} solid transparent`,
              borderBottom: `${rpx(6)} solid transparent`,
              borderLeft: `${rpx(9)} solid white`,
              marginLeft: rpx(2),
            }}
          />
        )}
      </button>
    </div>
  )
}

// Desktop and mobile shown side by side per step instead of as two separate
// flows — pairing them makes the responsive correlation visible directly.
// Both `desktop` and `mobile` are optional per pair (unlike Live REGi's
// version of this component, which only ever dropped the mobile side) —
// OMHS has a couple of steps that only exist on one platform in either
// direction, so a pair with just one column simply renders that one,
// full width, instead of leaving an empty gap next to it.
function PairedFlow({ groups, onImageClick }) {
  let count = 0
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading} style={{ marginTop: rpx(32) }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(17),
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            {group.heading}
          </p>
          <div style={{ marginTop: rpx(16), display: 'flex', flexDirection: 'column', gap: rpx(28) }}>
            {group.pairs.map((pair) => {
              count += 1
              const n = count
              return (
                <div key={pair.label}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(14),
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {n}. {pair.label}
                  </p>
                  <div style={{ marginTop: rpx(10), display: 'flex', alignItems: 'flex-start', gap: rpx(20) }}>
                    {pair.desktop && (
                      <div style={{ flex: pair.mobile ? '1 1 0' : '0 1 auto', minWidth: 0, maxWidth: pair.mobile ? undefined : rpx(480) }}>
                        <p style={{ margin: `0 0 ${rpx(6)} 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(11), fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.3)' }}>
                          Desktop
                        </p>
                        <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                          <ClickableImage
                            src={pair.desktop}
                            alt={`${pair.label} (desktop)`}
                            onClick={() => onImageClick?.({ src: pair.desktop, alt: `${pair.label} (desktop)` })}
                          />
                        </div>
                      </div>
                    )}
                    {pair.mobile && (
                      <div style={{ width: rpx(220), flexShrink: 0 }}>
                        <p style={{ margin: `0 0 ${rpx(6)} 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(11), fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.3)' }}>
                          Mobile
                        </p>
                        <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                          <ClickableImage
                            src={pair.mobile}
                            alt={`${pair.label} (mobile)`}
                            maxHeight={rpx(560)}
                            onClick={() => onImageClick?.({ src: pair.mobile, alt: `${pair.label} (mobile)` })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{ margin: `${rpx(10)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                    {pair.note}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

// Research and planning artifacts, not final product screens, so this skips
// PairedFlow's Desktop/Mobile/numbered-step treatment entirely and just lays
// each image out with its own caption, side by side for the two personas
// ('row') or stacked full width for everything else ('stack'), same
// ClickableImage-into-Lightbox behavior as every other image on this page.
function ProcessGallery({ groups, onImageClick }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading} style={{ marginTop: rpx(32) }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: rpx(17),
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            {group.heading}
          </p>
          {group.layout === 'scroll' ? (
            // A horizontally scrolling row instead of stacking every image
            // full width — for a group like this one with several dense
            // diagrams, that was eating a lot of vertical space for not
            // much more legibility than a smaller, scrollable version gets.
            <div
              style={{
                marginTop: rpx(16),
                display: 'flex',
                gap: rpx(12),
                overflowX: 'auto',
                paddingBottom: rpx(8),
              }}
            >
              {group.items.map((item) => {
                // Computed from the image's real aspect ratio rather than
                // left to shrink-to-fit, so the caption below has an actual
                // width to wrap against instead of spilling out to its own
                // single-line width (which is what "width: fit-content" on
                // the image box alone let happen).
                const itemWidth = rpx(PROCESS_SCROLL_HEIGHT * (item.aspectRatio ?? 1))
                return (
                  <div key={item.src} style={{ flexShrink: 0, width: itemWidth }}>
                    <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden', width: itemWidth }}>
                      <ClickableImage
                        src={item.src}
                        alt={item.alt}
                        fixedHeight={rpx(PROCESS_SCROLL_HEIGHT)}
                        onClick={() => onImageClick?.({ src: item.src, alt: item.alt })}
                      />
                    </div>
                    <p style={{ margin: `${rpx(8)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(15), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                      {item.caption}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                marginTop: rpx(16),
                display: 'flex',
                flexDirection: group.layout === 'row' ? 'row' : 'column',
                flexWrap: 'wrap',
                gap: rpx(28),
              }}
            >
              {group.items.map((item) => (
                <div
                  key={item.src}
                  style={{
                    flex: item.maxWidth ? '0 1 auto' : group.layout === 'row' ? '1 1 320px' : '1 1 auto',
                    minWidth: 0,
                    maxWidth: item.maxWidth,
                  }}
                >
                  <div style={{ border: HAIRLINE, borderRadius: rpx(10), overflow: 'hidden' }}>
                    <ClickableImage
                      src={item.src}
                      alt={item.alt}
                      onClick={() => onImageClick?.({ src: item.src, alt: item.alt })}
                    />
                  </div>
                  {/* A group-level caption (see Early Sketches above) covers
                      the whole set at once below instead — skip the
                      per-item one here so there's no text splitting up
                      images that belong together. */}
                  {!group.caption && item.caption && (
                    <p style={{ margin: `${rpx(10)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {group.caption && (
            <p style={{ margin: `${rpx(10)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(17), lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.72)' }}>
              {group.caption}
            </p>
          )}
        </div>
      ))}
    </>
  )
}

export default function OMHSCaseStudy({ onBack, onNextProject, nextProjectLabel }) {
  const sectionRefs = useRef([])
  const contentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [backHovered, setBackHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { root, rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Sidebar */}
      <div
        style={{
          width: rpx(260),
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          padding: `${rpx(32)} ${rpx(32)} ${rpx(160)} ${rpx(24)}`,
          borderRight: HAIRLINE,
        }}
      >
        <motion.button
          data-cursor-hover="button"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backgroundColor: backHovered ? 'rgba(30, 58, 138, 0.08)' : 'rgba(30, 58, 138, 0)',
            transition: { opacity: { delay: 0.15, duration: 0.3 }, backgroundColor: { duration: 0.2 } },
          }}
          onClick={onBack}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: `${rpx(6)} ${rpx(12)}`,
            margin: `${rpx(-6)} ${rpx(-12)}`,
            fontFamily: 'var(--font-sans)',
            fontSize: rpx(16),
            color: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          ← Back
        </motion.button>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
          style={{ marginTop: rpx(28), display: 'flex', flexDirection: 'column', gap: rpx(14) }}
        >
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const groupActive = item.children.some((child) => child.index === activeIndex)
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: rpx(10) }}>
                  <button
                    data-cursor-hover="button"
                    onClick={() => scrollToSection(item.index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      fontSize: rpx(15),
                      lineHeight: 1.4,
                      fontWeight: groupActive ? 600 : 400,
                      color: groupActive ? NAVY : 'rgba(0, 0, 0, 0.5)',
                      transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                    }}
                  >
                    {item.label}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: rpx(10), paddingLeft: rpx(16), borderLeft: HAIRLINE }}>
                    {item.children.map((child) => {
                      const active = child.index === activeIndex
                      return (
                        <button
                          key={child.label}
                          data-cursor-hover="button"
                          onClick={() => scrollToSection(child.index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            textAlign: 'left',
                            fontFamily: 'var(--font-sans)',
                            fontSize: rpx(14),
                            lineHeight: 1.4,
                            fontWeight: active ? 600 : 400,
                            color: active ? NAVY : 'rgba(0, 0, 0, 0.45)',
                            transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                          }}
                        >
                          {child.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            }

            const active = item.index === activeIndex
            return (
              <button
                key={item.label}
                data-cursor-hover="button"
                onClick={() => scrollToSection(item.index)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(15),
                  lineHeight: 1.4,
                  fontWeight: active ? 600 : 400,
                  color: active ? NAVY : 'rgba(0, 0, 0, 0.5)',
                  transition: 'color 0.2s ease-out, font-weight 0.2s ease-out',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </motion.nav>
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.35 } }}
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          height: '100%',
          overflowY: 'auto',
          padding: `${rpx(32)} ${rpx(64)} ${rpx(96)} ${rpx(72)}`,
        }}
      >
        <h1 style={{ margin: 0, maxWidth: rpx(760), fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(42), lineHeight: 1.15, color: 'var(--color-text)' }}>
          Oakville & Milton Humane Society
        </h1>
        <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.5)' }}>
          Replacing a shelter's spreadsheet with a real tool for managing pet care and volunteers
        </p>

        {/* Hero — the real product demo clip. */}
        <div style={{ marginTop: rpx(28), width: '100%', maxWidth: rpx(760), border: '1px solid rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
          <PlayableVideo src="/home/humanesociety/humanesociety-demo.mp4" poster="/home/humanesociety/humanesociety-demo-poster.jpg" />
        </div>

        {/* Metadata strip — a fixed grid of equal-width columns (not
            flex+space-between, which let a long value's column crowd its
            neighbors) so every label gets consistent room. A value can be
            an array (see Team above) to stack as separate lines instead of
            one run-on line. */}
        <div
          style={{
            marginTop: rpx(28),
            maxWidth: rpx(760),
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            columnGap: rpx(32),
            rowGap: rpx(20),
            padding: `${rpx(26)} 0`,
            borderTop: HAIRLINE,
            borderBottom: HAIRLINE,
          }}
        >
          {METADATA.map(({ label, value }) => {
            const lines = Array.isArray(value) ? value : value ? [value] : null
            return (
              <div key={label}>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(14), fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
                  {label}
                </p>
                {lines ? (
                  lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        margin: `${i === 0 ? rpx(10) : rpx(4)} 0 0 0`,
                        fontFamily: 'var(--font-sans)',
                        fontSize: rpx(18),
                        color: 'var(--color-text)',
                      }}
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.4)' }}>
                    Add this
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Overview */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
          style={{ marginTop: rpx(56) }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: rpx(13), letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.45)' }}>
            Overview
          </p>
          <p style={{ margin: `${rpx(14)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(42), lineHeight: 1.2, color: 'var(--color-text)' }}>
            A shelter running entirely on paper and a shared spreadsheet needed a system built for how
            they actually work.
          </p>
          <p style={{ margin: `${rpx(16)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(19), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.55)' }}>
            Built pro bono over 12 months for the Oakville & Milton Humane Society, this platform gives
            admins, staff, behaviourists, and volunteers one shared place to manage pet care tasks, assign
            them to the right person, and see exactly who did what, replacing whiteboards, paper records,
            and a single spreadsheet that was tracking all of it at once.
          </p>
        </motion.section>

        {/* Problem */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Which started with a shelter tracking everything by hand.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Before this, OMHS ran pet care and volunteer coordination on whiteboards and paper records,
            with a shared spreadsheet as the closest thing to a source of truth. Assigning a task meant
            knowing, from memory, who was around and who was actually trained for that animal. Nothing was
            tracked automatically, and nothing was easy to look back on.
          </p>

          {/* Stat row — the scale numbers pulled out of the paragraph above
              and given room to actually read as numbers, so this section
              isn't just two dense paragraphs back to back. Each one gets its
              own card rather than sitting cramped in a plain row. */}
          <div style={{ marginTop: rpx(28), maxWidth: rpx(820), display: 'flex', flexWrap: 'wrap', gap: rpx(20) }}>
            {[
              { value: '19', label: 'active dog kennels' },
              { value: '30', label: 'cats' },
              { value: '70+', label: 'volunteers' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: '1 1 160px',
                  background: SCREEN_MAT,
                  borderRadius: rpx(12),
                  padding: `${rpx(24)} ${rpx(28)}`,
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(44), color: NAVY }}>
                  {stat.value}
                </p>
                <p style={{ margin: `${rpx(8)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(14), color: 'rgba(0, 0, 0, 0.55)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p style={{ margin: `${rpx(28)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            The team designed around four real roles, each with different responsibilities, and around a
            skill-matching problem underneath all of it: not every volunteer is trained or comfortable with
            every animal, so the system needed to know that too, not just who was free.
          </p>

          {/* Role badges — same idea as the stat row above, a quick visual
              break instead of a fourth role buried in a parenthetical. */}
          <div style={{ marginTop: rpx(16), display: 'flex', flexWrap: 'wrap', gap: rpx(10) }}>
            {['Admin', 'Staff', 'Behaviourist', 'Volunteer'].map((role) => (
              <span
                key={role}
                style={{
                  padding: `${rpx(6)} ${rpx(14)}`,
                  borderRadius: '999px',
                  border: `1px solid ${NAVY}`,
                  fontFamily: 'var(--font-sans)',
                  fontSize: rpx(14),
                  fontWeight: 500,
                  color: NAVY,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Process */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Before any of it was a real screen, it started with who'd actually be using it.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.6)' }}>
            Two personas grounded in real shelter roles, an early pass at what each role should actually be
            able to see and do, the user flows that came out of that, and the first hand-drawn sketches
            before any of it reached Figma.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <ProcessGallery groups={PROCESS_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* Pet List */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Starting with the pets themselves, at a shelter and standing in a kennel alike.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.6)' }}>
            Browsing, filtering, and adding pets, tablet and mobile shown side by side wherever both exist.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <PairedFlow groups={PET_LIST_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* User Management */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[4] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>Then the tools admins use to manage who's actually on the team.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.6)' }}>
            Admin-only: browsing the user list, filtering it by animal tag, and inviting new people onto
            the platform.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <PairedFlow groups={USER_MANAGEMENT_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* User Profile */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[5] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>One profile screen, very different controls depending on who's looking.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.6)' }}>
            An admin viewing or editing someone else's profile, and what a volunteer sees looking at their
            own.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <PairedFlow groups={USER_PROFILE_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* Task Management */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[6] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>And the task templates that everything else actually gets assigned from.</Transition>
          <p style={{ margin: `${rpx(12)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), color: 'rgba(0, 0, 0, 0.6)' }}>
            Admin-only, same as User Management above: browsing, filtering, viewing, and adding the task
            templates behind every pet's care, things like Morning Walk or Feeding, each with its own
            category and instructions.
          </p>
          <div style={{ maxWidth: rpx(1040) }}>
            <PairedFlow groups={TASK_MANAGEMENT_GROUPS} onImageClick={setLightbox} />
          </div>
        </motion.section>

        {/* Design Considerations */}
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[7] = el
          }}
          style={{ marginTop: rpx(72) }}
        >
          <Transition>A few decisions here came directly from how a shelter actually runs.</Transition>

          {/* Four consistently-styled cards instead of a run of paragraphs
              with one randomly singled out — same content, an actual system
              instead of an ad hoc mix. */}
          <div
            style={{
              marginTop: rpx(24),
              maxWidth: rpx(1040),
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: rpx(20),
            }}
          >
            {DESIGN_CONSIDERATIONS.map((item, i) => (
              <div
                key={item.title}
                style={{
                  background: SCREEN_MAT,
                  borderRadius: rpx(14),
                  padding: rpx(28),
                  borderTop: `3px solid ${NAVY}`,
                }}
              >
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(13), letterSpacing: '0.06em', color: NAVY }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(19), lineHeight: 1.3, color: 'var(--color-text)' }}>
                  {item.title}
                </p>
                <p style={{ margin: `${rpx(10)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.65)' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Reflection */}
        <div style={{ marginTop: rpx(96), maxWidth: rpx(820), borderTop: HAIRLINE }} />
        <motion.section
          {...REVEAL}
          ref={(el) => {
            sectionRefs.current[8] = el
          }}
          style={{ marginTop: rpx(40) }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: rpx(13),
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            Reflection
          </p>
          <p style={{ margin: `${rpx(14)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: rpx(38), lineHeight: 1.25, color: 'var(--color-text)' }}>
            A long pro bono project with a real client and real stakes.
          </p>
          <p style={{ margin: `${rpx(18)} 0 0 0`, maxWidth: rpx(820), fontFamily: 'var(--font-sans)', fontSize: rpx(18), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
            Twelve months is a long timeline for a project like this, spent working closely with a
            nonprofit client, a design team, and a much larger group of developers than any of the other
            projects here. It's also the one with the highest real-world stakes: the volunteers using this
            are the reason 19 kennels of dogs and 30 cats get walked, fed, and cared for on schedule.
          </p>

          {/* What it actually taught, not just what shipped. */}
          <div style={{ marginTop: rpx(36), display: 'flex', flexDirection: 'column', gap: rpx(28), maxWidth: rpx(820) }}>
            {TAKEAWAYS.map((takeaway) => (
              <div key={takeaway.title} style={{ display: 'flex', gap: rpx(16), alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(18), color: NAVY, lineHeight: 1.4 }}>{takeaway.icon}</span>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: rpx(19), color: 'var(--color-text)' }}>
                    {takeaway.title}
                  </p>
                  <p style={{ margin: `${rpx(6)} 0 0 0`, fontFamily: 'var(--font-sans)', fontSize: rpx(16), lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.6)' }}>
                    {takeaway.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Next project */}
        {onNextProject && (
          <div style={{ marginTop: rpx(56), maxWidth: rpx(820), paddingTop: rpx(32), borderTop: HAIRLINE }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: rpx(13), letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.4)' }}>
              Next case study
            </p>
            <motion.button
              data-cursor-hover="button"
              onClick={onNextProject}
              onMouseEnter={() => setNextHovered(true)}
              onMouseLeave={() => setNextHovered(false)}
              animate={{ x: nextHovered ? 4 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                marginTop: rpx(8),
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: rpx(28),
                color: NAVY,
              }}
            >
              {nextProjectLabel} →
            </motion.button>
          </div>
        )}
      </motion.div>

      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
