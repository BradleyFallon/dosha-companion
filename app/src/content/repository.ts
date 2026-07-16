import {
  checkInQuestionSets,
  glossaryEntries,
  learningArticles,
  recommendationCatalog,
  type CheckInQuestionSet,
  type GlossaryEntry,
  type LearningArticle,
  type RecommendationContent,
} from '../generated/contentCatalog'

export interface ContentSearchResult {
  id: string
  type: 'article' | 'glossary' | 'recommendation'
  title: string
  summary: string
  href: string
  score: number
}

export function getLearningArticles(): LearningArticle[] {
  return learningArticles.filter(isVisible).sort((left, right) => left.title.localeCompare(right.title))
}

export function getLearningArticle(id: string): LearningArticle | null {
  return getLearningArticles().find((article) => article.id === id) ?? null
}

export function getGlossaryEntries(): GlossaryEntry[] {
  return glossaryEntries.filter(isVisible).sort((left, right) => left.term.localeCompare(right.term))
}

export function getRecommendations(): RecommendationContent[] {
  return recommendationCatalog.filter(isVisible)
}

export function getCheckInQuestionSets(): CheckInQuestionSet[] {
  return checkInQuestionSets.filter(isVisible)
}

export function getCheckInQuestionSet(id: string): CheckInQuestionSet | null {
  return getCheckInQuestionSets().find((set) => set.id === id) ?? null
}

export function searchLearningContent(query: string): ContentSearchResult[] {
  const stopWords = new Set(['a', 'an', 'and', 'about', 'do', 'does', 'how', 'in', 'is', 'my', 'of', 'or', 'the', 'this', 'to', 'was', 'what', 'why'])
  const terms = normalize(query).split(/\s+/).filter((term) => term.length > 1 && !stopWords.has(term))
  if (terms.length === 0) return []

  const results: ContentSearchResult[] = []
  for (const article of getLearningArticles()) {
    const score = scoreText(terms, [article.title, article.summary, article.tags.join(' '), article.body])
    if (score > 0) results.push({ id: article.id, type: 'article', title: article.title, summary: article.summary, href: `/learn/${article.id}`, score })
  }
  for (const entry of getGlossaryEntries()) {
    const score = scoreText(terms, [entry.term, entry.aliases.join(' '), entry.definition])
    if (score > 0) results.push({ id: entry.id, type: 'glossary', title: entry.term, summary: entry.definition, href: `/learn/glossary#${entry.id}`, score })
  }
  for (const recommendation of getRecommendations()) {
    const score = scoreText(terms, [recommendation.title, recommendation.summary, recommendation.rationale, recommendation.tags.join(' ')])
    if (score > 0) results.push({ id: recommendation.id, type: 'recommendation', title: recommendation.title, summary: recommendation.rationale, href: `/learn/${recommendation.relatedArticleId}`, score })
  }
  return results.sort((left, right) => right.score - left.score || left.title.localeCompare(right.title)).slice(0, 8)
}

function scoreText(terms: string[], fields: string[]) {
  const normalized = fields.map(normalize)
  return terms.reduce((score, term) => score + normalized.reduce((fieldScore, field, index) => fieldScore + (field.includes(term) ? (index === 0 ? 4 : 1) : 0), 0), 0)
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function isVisible(content: { publicationStatus: string }) {
  return content.publicationStatus === 'published'
}
