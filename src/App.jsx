import { useLocation } from 'react-router-dom'
import Shell from './components/Shell.jsx'

const ACTIVE_BY_PATH = {
  '/': 'home',
  '/who': 'who',
  '/work': 'work',
  '/play': 'play',
}

// Shell is mounted once and stays mounted for the whole app — only the
// "active" section changes as the URL changes, which is what lets the
// columns animate their width (sliding-door effect) instead of the whole
// page unmounting/remounting on navigation.
//
// Matched on just the first path segment (not the full pathname) so a real
// case-study route like /work/ophelia-ai-canvas still resolves to the
// "work" section — same flip panel, no re-flip when moving between the
// grid and a case study, just a different sub-path within it. See
// WorkContent.jsx, which reads that second segment itself to know which
// case study (if any) to show.
export default function App() {
  const location = useLocation()
  const firstSegment = '/' + location.pathname.split('/')[1]
  const active = ACTIVE_BY_PATH[firstSegment] ?? 'home'

  return <Shell active={active} />
}
