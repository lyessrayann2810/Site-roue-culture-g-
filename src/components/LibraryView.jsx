import { Search } from 'lucide-react'

const labels = { unseen: 'Jamais vu', encountered: 'Rencontré', review: 'À revoir', mastered: 'Maîtrisé' }

export default function LibraryView({ title, list, query, setQuery, filterCat, setFilterCat, filterStatus, setFilterStatus, categories, getStatus, favorites, toggleFavorite, openDetail }) {
  return <>
    <div className="sectionHead"><div><span className="eyebrow">EXPLORER</span><h1>{title}</h1></div></div>
    <div className="filters">
      <label><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un sujet…" /></label>
      <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}><option value="">Tous les univers</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="">Tous les statuts</option>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
    </div>
    <div className="libraryGrid">
      {list.map((topic) => {
        const status = getStatus(topic)
        return <article className="topicCard" key={`${topic.cat}|${topic.title}`} onClick={() => openDetail(topic)}>
          <span>{topic.cat}</span><h3>{topic.title}</h3><p>{topic.desc}</p>
          <div className="cardFoot"><i className={`status ${status}`}>{labels[status]}</i><button onClick={(e) => { e.stopPropagation(); toggleFavorite(topic) }}>{favorites.includes(topic.title) ? '★' : '☆'}</button></div>
        </article>
      })}
    </div>
  </>
}
