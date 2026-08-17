// Graphic design pieces shown in the PLAYGROUND section (see PlayContent.jsx
// for the bento gallery that renders these).
//
// `thumbnails` — every page shown for this piece, in order, rendered from
// the original PDF via `pdftoppm` and then resized/compressed (matches the
// pipeline used for the WHO photos and the case-study screenshots). Single-
// page pieces just have a one-item array. `file` is the original PDF (or,
// for a piece with no separate PDF, the full-size image itself), opened in
// a new tab when a piece is clicked.
// `software` — what each piece was made in, shown as a small subtitle
// under the title (see PlayContent.jsx).
export const PLAYGROUND_ITEMS = [
  {
    id: 'beach-olympic-ticket',
    title: 'Beach Volleyball Olympic Ticket',
    software: 'Adobe Illustrator, Adobe InDesign',
    thumbnails: ['/playground/beach-olympic-ticket.png'],
    file: '/playground/beach-olympic-ticket.pdf',
  },
  {
    id: 'gym-olympic-ticket',
    title: 'Gymnastics Olympic Ticket',
    software: 'Adobe Illustrator, Adobe InDesign',
    thumbnails: ['/playground/gym-olympic-ticket.png'],
    file: '/playground/gym-olympic-ticket.pdf',
  },
  {
    id: 'menu-design',
    title: 'Menu Design',
    software: 'Adobe Illustrator, Adobe InDesign',
    thumbnails: [
      '/playground/opt-menu-design-page-1.jpg',
      '/playground/opt-menu-design-page-2.jpg',
      '/playground/opt-menu-design-page-3.jpg',
    ],
    file: '/playground/menu-design.pdf',
  },
  {
    id: 'mini-mag',
    title: 'Mini Mag',
    software: 'Adobe InDesign',
    thumbnails: [
      '/playground/opt-mini-mag-page-1.jpg',
      '/playground/opt-mini-mag-page-2.jpg',
      '/playground/opt-mini-mag-page-3.jpg',
    ],
    file: '/playground/mini-mag.pdf',
  },
  {
    id: 'colour-palette',
    title: 'Colour Palette',
    software: 'Adobe Illustrator',
    thumbnails: ['/playground/opt-colour-palette-page-1.jpg'],
    file: '/playground/colour-palette.pdf',
  },
  {
    id: 'art-deco',
    title: 'Art Deco',
    software: 'Adobe Illustrator',
    thumbnails: ['/playground/opt-art-deco.jpg'],
    file: '/playground/opt-art-deco.jpg',
  },
]
