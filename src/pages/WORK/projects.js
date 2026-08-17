// Shared case-study list — used by the home page's hover list and (later)
// the full WORK page. Add real preview images/content here as they're ready.
//
// Not every entry here is necessarily shown in the WORK grid at once — see
// WORK_GRID_IDS in WorkContent.jsx, which picks which projects actually
// fill the 4 grid slots by id. Oakville/Milton Humane Society stays defined
// here (previewGroups and all) even while it's not one of the 4 visible
// slots, so that work isn't lost — just swap its id into WORK_GRID_IDS
// whenever it's ready to go back on display.
//
// `previewGroups` — Figma exports shown as a rotating gallery in the
// floating preview panel (ProjectPreview.jsx) when this case study is
// hovered: each inner array is one group, shown as a full-width vertical
// stack, cross-fading to the next group every couple seconds. Grouped in
// threes here in the order they're meant to appear together (mixing a
// mobile screen, an admin view, and a user-facing view per group, rather
// than alphabetical/by-type) so every group shows some range of the
// project instead of a run of near-identical admin screens.
export const PROJECTS = [
  {
    id: 'bitesize',
    label: '01 // Bitesize',
    description: null,
    previewColor: '#dce8d0',
  },
  {
    id: 'oakville-milton-humane-society',
    label: '02 // Oakville and Milton Humane Society',
    description: 'Redesigning the digital adoption experience',
    previewColor: '#c9d6e8',
    previewGroups: [
      [
        '/home/humanesociety/opt-iphone-16-73.png',
        '/home/humanesociety/opt-admin-view-pet-list-animal-tag-filter.png',
        '/home/humanesociety/opt-user-view-user-profile.png',
      ],
      [
        '/home/humanesociety/opt-iphone-16-97.png',
        '/home/humanesociety/opt-admin-view-user-management.png',
        '/home/humanesociety/opt-interaction-log.png',
      ],
      [
        '/home/humanesociety/opt-mobile-task-view.png',
        '/home/humanesociety/opt-admin-view-task-management1.png',
        '/home/humanesociety/opt-user-view-user-profile1.png',
      ],
      [
        '/home/humanesociety/opt-user-management.png',
        '/home/humanesociety/opt-admin-view-interaction-log.png',
        '/home/humanesociety/opt-admin-view-interaction-log1.png',
      ],
    ],
  },
  {
    id: 'serviceontario-integration',
    label: '03 // ServiceOntario Integration',
    description: 'Enterprise tools for government services',
    previewColor: '#d8cbe0',
  },
  {
    id: 'orbit-mobile-design',
    label: '04 // Orbit Mobile Design',
    description: 'Helping students discover campus events',
    previewColor: '#cfe0d3',
  },
  {
    id: 'ophelia-ai-interface',
    label: '05 // Ophelia AI Interface',
    description: 'An infinite AI canvas for directing image and video generation',
    previewColor: '#e8d4c9',
  },
]
