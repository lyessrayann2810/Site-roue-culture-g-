export default function HistoryView({ encountered, learned, topics, openDetail, exportData }) {
  const renderRows = (items) => items.slice().reverse().map((item) => {
    const topic = topics.find((t) => t.title === item.title)
    if (!topic) return null
    return <button className="historyRow" key={`${item.title}-${item.ts}`} onClick={() => openDetail(topic)}><div><span>{topic.cat}</span><b>{topic.title}</b></div><small>{new Date(item.ts).toLocaleDateString('fr-FR')}</small></button>
  })
  return <>
    <div className="sectionHead"><div><span className="eyebrow">PROGRESSION</span><h1>Historique</h1></div><button className="ghost" onClick={exportData}>Exporter mes données</button></div>
    <section className="historyCols"><div><h2>Sujets appris</h2>{renderRows(learned)}</div><div><h2>Sujets rencontrés</h2>{renderRows(encountered)}</div></section>
  </>
}
