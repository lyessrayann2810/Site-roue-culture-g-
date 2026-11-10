import { BookOpen, Grid3X3, History, Home, RotateCcw, Star } from 'lucide-react'

const items = [
  ['home', 'Accueil', Home],
  ['univers', 'Univers', Grid3X3],
  ['library', 'Bibliothèque', BookOpen],
  ['favorites', 'Favoris', Star],
  ['history', 'Historique', History],
  ['review', 'Révisions', RotateCcw],
]

export default function Sidebar({ view, dueCount, onNavigate }) {
  return (
    <aside className="sidebar">
      <button className="logo" onClick={() => onNavigate('home')} aria-label="Retour à l’accueil">LZ</button>
      <nav>
        {items.map(([id, label, Icon]) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => onNavigate(id)}>
            <span className="navIcon"><Icon size={18} /></span>
            <span>{label}</span>
            {id === 'review' && dueCount > 0 && <em>{dueCount}</em>}
          </button>
        ))}
      </nav>
    </aside>
  )
}
