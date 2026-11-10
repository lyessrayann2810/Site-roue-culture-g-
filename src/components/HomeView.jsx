import { DATA, META } from '../data'

function Stat({ value, label, wide = false }) {
  return <div className={`stat ${wide ? 'wide' : ''}`}><b>{value}</b><span>{label}</span></div>
}

export default function HomeView({ topics, study, encountered, learned, due, surpriseMode, setSurpriseMode, openSurprise, openCategory }) {
  const categories = Object.keys(DATA)
  const mastered = Object.values(study).filter((x) => x.status === 'mastered').length
  const counts = learned.reduce((acc, x) => {
    acc[x.cat] = (acc[x.cat] || 0) + 1
    return acc
  }, {})
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const seen = new Set(encountered.map((x) => x.title))

  return <>
    <header className="hero">
      <span className="eyebrow">LE SITE DE CULTURE DE LYESS ZAYN</span>
      <h1>Un sujet à la fois.<br />Une culture qui s’accumule.</h1>
      <p>Choisis un univers, fais tourner la roue et transforme les découvertes en connaissances durables.</p>
    </header>

    <section className="stats">
      <Stat value={mastered} label="Maîtrisés" />
      <Stat value={due.length} label="À revoir aujourd’hui" />
      <Stat value={encountered.length} label="Rencontrés" />
      <Stat value={top?.[0] || '—'} label="Univers le plus étudié" wide />
    </section>

    <section className="surpriseCard">
      <div>
        <span className="eyebrow">∞ SURPRISE TOTALE</span>
        <h2>Tu ne choisis pas le domaine. La roue décide.</h2>
        <p>Pioche dans l’ensemble de ta culture générale.</p>
      </div>
      <div className="surpriseActions">
        <select value={surpriseMode} onChange={(e) => setSurpriseMode(e.target.value)}>
          <option value="unseen">Jamais vus uniquement</option>
          <option value="all">Tout mélanger</option>
          <option value="review">À revoir</option>
        </select>
        <button className="primary" onClick={openSurprise}>Lancer la surprise</button>
      </div>
    </section>

    <section className="sectionHead">
      <div><span className="eyebrow">UNIVERS</span><h2>Choisis ton terrain de jeu</h2></div>
      <span>{categories.length} univers · {topics.length} sujets</span>
    </section>

    <div className="grid">
      {categories.map((cat, index) => {
        const meta = META[cat] || {}
        const items = DATA[cat]
        const masteredCount = items.filter((t) => study[t.title]?.status === 'mastered').length
        const unseenCount = items.filter((t) => !seen.has(t.title)).length
        return (
          <button className="catCard" key={cat} style={{ '--accent': meta.accent || '#8b5cf6' }} onClick={() => openCategory(cat)}>
            <div className="catTop"><span>{String(index + 1).padStart(2, '0')}</span><b>{meta.icon || '•'}</b></div>
            <h3>{cat}</h3>
            <p>{meta.desc}</p>
            <div className="progressInfo">{items.length} total · {unseenCount} jamais vus · {masteredCount} maîtrisés<div><i style={{ width: `${(masteredCount / items.length) * 100}%` }} /></div></div>
          </button>
        )
      })}
    </div>
  </>
}
