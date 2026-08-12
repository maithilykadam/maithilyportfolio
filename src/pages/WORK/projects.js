// Shared case-study list — used by the home page's hover list and (later)
// the full WORK page. Add real preview images/content here as they're ready.
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
    id: 'oakville-milton-humane-society',
    label: '01 // Oakville and Milton Humane Society',
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
    label: '02 // ServiceOntario Integration',
    description: 'Enterprise tools for government services',
    previewColor: '#d8cbe0',
  },
  {
    id: 'orbit-mobile-design',
    label: '03 // Orbit Mobile Design',
    description: 'Helping students discover campus events',
    previewColor: '#cfe0d3',
  },
  {
    id: 'ophelia-ai-interface',
    label: '04 // Ophelia AI Interface',
    description: 'An infinite AI canvas for directing image and video generation',
    previewColor: '#e8d4c9',
  },
]
