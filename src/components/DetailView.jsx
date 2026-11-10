import { CheckCircle2, ChevronLeft, Clock3, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { CURATED_ARTICLES, LOCAL_ARTICLES } from '../data'

export default function DetailView({ topic, favorites, toggleFavorite, markReview, markMastered, status, back }) {
  const article = CURATED_ARTICLES[topic.title] || LOCAL_ARTICLES[topic.title] || { lead: topic.desc, paragraphs: [topic.desc], takeaway: `À retenir : ${topic.desc}` }
  const [showAnswer, setShowAnswer] = useState(false)

  return <>
    <button className="back" onClick={back}><ChevronLeft size={17} />Retour</button>
    <article className="article">
      <span className="eyebrow">{topic.cat}</span>
      <h1>{topic.title}</h1>
      <p className="lead">{article.lead || topic.desc}</p>
      {(article.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
      <div className="takeaway"><Sparkles size={18} /><span>{article.takeaway || `À retenir : ${topic.desc}`}</span></div>
      <div className="actions">
        <button className="ghost" onClick={() => toggleFavorite(topic)}>{favorites.includes(topic.title) ? '★ Favori' : '☆ Favori'}</button>
        <button className="reviewBtn" onClick={() => markReview(topic)}><Clock3 size={16} />À revoir</button>
        <button className="masterBtn" onClick={() => markMastered(topic)}><CheckCircle2 size={16} />{status === 'mastered' ? 'Maîtrisé' : 'Je maîtrise'}</button>
      </div>
      <div className="qpuc">
        <span className="eyebrow">QUESTION POUR UN CHAMPION</span>
        <p>Quel terme correspond à cette définition : {topic.desc.replace(/\.$/, '')} ?</p>
        <button className="ghost" onClick={() => setShowAnswer((v) => !v)}>{showAnswer ? topic.title : 'Voir la réponse'}</button>
      </div>
    </article>
  </>
}
