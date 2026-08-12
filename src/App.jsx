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
export default function App() {
  const location = useLocation()
  const active = ACTIVE_BY_PATH[location.pathname] ?? 'home'

  return <Shell active={active} />
}
