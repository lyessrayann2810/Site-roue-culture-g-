import { ChevronLeft } from 'lucide-react'

export default function WheelView({ category, wheel, rotation, spinning, selected, favorites, spin, refresh, openDetail, toggleFavorite, back }) {
  const step = 360 / Math.max(1, wheel.length)
  return <>
    <button className="back" onClick={back}><ChevronLeft size={17} />Accueil</button>
    <div className="wheelHead">
      <div><span className="eyebrow">{category}</span><h1>La roue du jour</h1></div>
      <button className="ghost" onClick={refresh}>Nouveaux sujets</button>
    </div>
    <div className="wheelWrap">
      <div className="pointer">▼</div>
      <div className="wheel" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 2.6s cubic-bezier(.12,.65,.12,1)' : 'none' }}>
        {wheel.map((topic, i) => {
          const angle = i * step + step / 2
          return <div className="wheelLabel" key={topic.title} style={{ transform: `rotate(${angle}deg) translateY(-132px) rotate(${-angle}deg)` }}>{topic.title}</div>
        })}
      </div>
      <button className="spin" onClick={spin} disabled={spinning}>{spinning ? '…' : 'GO'}</button>
    </div>
    {selected && <section className="result">
      <span className="eyebrow">SUJET SÉLECTIONNÉ</span>
      <h2>{selected.title}</h2>
      <p>{selected.desc}</p>
      <div className="actions">
        <button className="primary" onClick={() => openDetail(selected)}>Étudier maintenant</button>
        <button className="ghost" onClick={() => toggleFavorite(selected)}>{favorites.includes(selected.title) ? '★ Favori' : '☆ Ajouter aux favoris'}</button>
      </div>
    </section>}
  </>
}
