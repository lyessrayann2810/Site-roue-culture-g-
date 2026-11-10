import { useEffect, useMemo, useState } from 'react'
import { DATA } from './data'
import Sidebar from './components/Sidebar'
import HomeView from './components/HomeView'
import WheelView from './components/WheelView'
import LibraryView from './components/LibraryView'
import DetailView from './components/DetailView'
import HistoryView from './components/HistoryView'
import { storage } from './lib/storage'
import { allTopics, REVIEW_INTERVALS, shuffledPick } from './lib/topics'

export default function App() {
  const [view, setView] = useState('home')
  const [category, setCategory] = useState(null)
  const [wheel, setWheel] = useState([])
  const [selected, setSelected] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [favorites, setFavorites] = useState(() => storage.get('lz_favorites', []))
  const [encountered, setEncountered] = useState(() => storage.get('lz_encountered', []))
  const [learned, setLearned] = useState(() => storage.get('lz_learned', []))
  const [study, setStudy] = useState(() => storage.get('lz_study', {}))
  const [decks, setDecks] = useState(() => storage.get('lz_decks', {}))
  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [surpriseMode, setSurpriseMode] = useState('unseen')

  const topics = useMemo(allTopics, [])
  const categories = Object.keys(DATA)

  useEffect(() => storage.set('lz_favorites', favorites), [favorites])
  useEffect(() => storage.set('lz_encountered', encountered), [encountered])
  useEffect(() => storage.set('lz_learned', learned), [learned])
  useEffect(() => storage.set('lz_study', study), [study])
  useEffect(() => storage.set('lz_decks', decks), [decks])

  const getStatus = (topic) => study[topic.title]?.status || (encountered.some((x) => x.title === topic.title) ? 'encountered' : 'unseen')

  const nextDeckBatch = (key, pool) => {
    const valid = new Set(pool.map((t) => t.title))
    let used = (decks[key] || []).filter((title) => valid.has(title))
    let available = pool.filter((topic) => !used.includes(topic.title))
    if (available.length < 8) {
      used = []
      available = [...pool]
    }
    const batch = shuffledPick(available, 8)
    setDecks((current) => ({ ...current, [key]: [...used, ...batch.map((t) => t.title)] }))
    return batch
  }

  const navigate = (target) => {
    setView(target)
    if (target === 'home') setCategory(null)
    window.scrollTo(0, 0)
  }

  const openCategory = (cat) => {
    setCategory(cat)
    setSelected(null)
    setWheel(nextDeckBatch(cat, DATA[cat].map((x) => ({ ...x, cat }))))
    setView('wheel')
    window.scrollTo(0, 0)
  }

  const surprisePool = () => {
    if (surpriseMode === 'unseen') {
      const seen = new Set(encountered.map((x) => x.title))
      const unseen = topics.filter((t) => !seen.has(t.title))
      if (unseen.length) return unseen
    }
    if (surpriseMode === 'review') {
      const reviewTitles = new Set(Object.entries(study).filter(([, value]) => value.status === 'review').map(([title]) => title))
      const reviewTopics = topics.filter((t) => reviewTitles.has(t.title))
      if (reviewTopics.length) return reviewTopics
    }
    return topics
  }

  const openSurprise = () => {
    setCategory('Surprise totale')
    setSelected(null)
    setWheel(nextDeckBatch(`surprise:${surpriseMode}`, surprisePool()))
    setView('wheel')
    window.scrollTo(0, 0)
  }

  const spin = () => {
    if (spinning || !wheel.length) return
    setSpinning(true)
    const index = Math.floor(Math.random() * wheel.length)
    const step = 360 / wheel.length
    const desired = 360 - (index * step + step / 2)
    const next = rotation + 360 * 6 + desired - (rotation % 360)
    setRotation(next)
    window.setTimeout(() => {
      const topic = wheel[index]
      setSelected(topic)
      setEncountered((current) => current.some((x) => x.title === topic.title) ? current : [...current, { title: topic.title, cat: topic.cat, ts: Date.now() }])
      setSpinning(false)
    }, 2600)
  }

  const refreshWheel = () => {
    if (category === 'Surprise totale') return openSurprise()
    setWheel(nextDeckBatch(category, DATA[category].map((x) => ({ ...x, cat: category }))))
    setSelected(null)
  }

  const openDetail = (topic) => {
    setSelected(topic)
    setLearned((current) => current.some((x) => x.title === topic.title) ? current : [...current, { title: topic.title, cat: topic.cat, ts: Date.now() }])
    setView('detail')
    window.scrollTo(0, 0)
  }

  const toggleFavorite = (topic) => setFavorites((current) => current.includes(topic.title) ? current.filter((x) => x !== topic.title) : [...current, topic.title])

  const markReview = (topic) => setStudy((current) => {
    const previous = current[topic.title] || {}
    const stage = Math.min((previous.stage ?? -1) + 1, REVIEW_INTERVALS.length - 1)
    return { ...current, [topic.title]: { status: 'review', stage, due: Date.now() + REVIEW_INTERVALS[stage] * 86400000, cat: topic.cat } }
  })

  const markMastered = (topic) => setStudy((current) => ({ ...current, [topic.title]: { status: 'mastered', stage: 4, due: null, cat: topic.cat } }))

  const due = Object.entries(study).filter(([, value]) => value.status === 'review' && value.due <= Date.now()).map(([title]) => topics.find((t) => t.title === title)).filter(Boolean)

  const library = topics.filter((topic) => {
    const haystack = `${topic.title} ${topic.desc} ${topic.cat}`.toLowerCase()
    return (!query || haystack.includes(query.toLowerCase())) && (!filterCat || topic.cat === filterCat) && (!filterStatus || getStatus(topic) === filterStatus)
  })

  const exportData = () => {
    const payload = { version: 'react-2', exportedAt: new Date().toISOString(), favorites, encountered, learned, study, decks }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lyess-culture-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return <div className="app">
    <Sidebar view={view} dueCount={due.length} onNavigate={navigate} />
    <main className="main">
      {(view === 'home' || view === 'univers') && <HomeView topics={topics} study={study} encountered={encountered} learned={learned} due={due} surpriseMode={surpriseMode} setSurpriseMode={setSurpriseMode} openSurprise={openSurprise} openCategory={openCategory} />}
      {view === 'wheel' && <WheelView category={category} wheel={wheel} rotation={rotation} spinning={spinning} selected={selected} favorites={favorites} spin={spin} refresh={refreshWheel} openDetail={openDetail} toggleFavorite={toggleFavorite} back={() => navigate('home')} />}
      {(view === 'library' || view === 'favorites') && <LibraryView title={view === 'favorites' ? 'Mes favoris' : 'Bibliothèque'} list={view === 'favorites' ? library.filter((t) => favorites.includes(t.title)) : library} query={query} setQuery={setQuery} filterCat={filterCat} setFilterCat={setFilterCat} filterStatus={filterStatus} setFilterStatus={setFilterStatus} categories={categories} getStatus={getStatus} favorites={favorites} toggleFavorite={toggleFavorite} openDetail={openDetail} />}
      {view === 'detail' && selected && <DetailView topic={selected} favorites={favorites} toggleFavorite={toggleFavorite} markReview={markReview} markMastered={markMastered} status={getStatus(selected)} back={() => setView(category ? 'wheel' : 'library')} />}
      {view === 'review' && <LibraryView title="Révisions du jour" list={due} query="" setQuery={() => {}} filterCat="" setFilterCat={() => {}} filterStatus="" setFilterStatus={() => {}} categories={categories} getStatus={getStatus} favorites={favorites} toggleFavorite={toggleFavorite} openDetail={openDetail} />}
      {view === 'history' && <HistoryView encountered={encountered} learned={learned} topics={topics} openDetail={openDetail} exportData={exportData} />}
    </main>
  </div>
}
