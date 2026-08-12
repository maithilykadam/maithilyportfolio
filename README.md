<<<<<<< HEAD
# maithilyportfolio
=======
# Maithily Kadam — Portfolio

React + Vite + Framer Motion.

## Setup

```
npm install
npm run dev
```

Open the local URL npm prints (usually http://localhost:5173).

## How it works

There's one persistent layout — `src/components/Shell.jsx` — with three
columns (WHO / WORK / PLAYGROUND) that never unmount. Navigating between
"/", "/who", "/work", "/play" just changes which column is expanded; the
other two animate down to a shared collapsed width. That's what gives the
sliding-door effect — the columns are always the same DOM elements, just
resizing.

## Structure

- `src/components/Shell.jsx` — the layout: owns column widths, the sliding
  animation, and which content to show in each column for the current route
- `src/App.jsx` — reads the current route and tells Shell which section is active
- `src/pages/Landing/HeroContent.jsx` — home-page hero (name + tagline), shown as an overlay only in the home state
- `src/pages/WHO/WhoContent.jsx` — body content for the expanded WHO section
- `src/pages/WORK/WorkContent.jsx` — body content for the expanded WORK section (still a placeholder — waiting on case study frames)
- `src/pages/PLAY/PlayContent.jsx` — body content for the expanded PLAYGROUND section (placeholder — no Figma frame yet)
- `src/components/RotatedLabel.jsx` — the rotated label shown in a collapsed column
- `src/components/ExpandedHeader.jsx` — shared header row (section label + "take me back")
- `src/constants/layout.js` — column widths per state, and the shared slide transition timing

To change what's inside a section, edit its `*Content.jsx` file — you
shouldn't need to touch `Shell.jsx` for that. To change the widths or the
animation feel, that's all in `constants/layout.js`.

## Next frames to send

Send the PLAYGROUND frame link, plus whatever you design for the WORK
page's case study content, and those will get built out to match.
>>>>>>> 0dfe38b (Initial commit: portfolio site)
