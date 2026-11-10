import { DATA } from '../data'

export const REVIEW_INTERVALS = [1, 3, 7, 14]

export function allTopics() {
  const out = []
  const seen = new Set()
  Object.entries(DATA).forEach(([cat, items]) => {
    items.forEach((topic) => {
      const key = topic.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
      if (!seen.has(key)) {
        seen.add(key)
        out.push({ ...topic, cat })
      }
    })
  })
  return out
}

export function shuffledPick(items, count = 8) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, Math.min(count, items.length))
}
