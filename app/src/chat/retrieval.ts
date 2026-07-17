import {
  getGlossaryEntries,
  getLearningArticle,
  getRecommendations,
  searchLearningContent,
} from '../content/repository'
import { seasonalProduceCatalog } from '../generated/contentCatalog'
import type { PrototypeState } from '../prototype/state'
import type {
  ChatCitation,
  ChatSourceExcerpt,
  ResolvedChatContext,
} from './types'

export function retrieveChatSources({
  question,
  context,
}: {
  question: string
  context: ResolvedChatContext
  state: PrototypeState
}): ChatSourceExcerpt[] {
  const results: ChatSourceExcerpt[] = []
  const add = (source: ChatSourceExcerpt | null) => {
    if (source && !results.some((item) => item.type === source.type && item.id === source.id)) results.push(source)
  }

  for (const id of context.sourceIds) add(sourceById(id))
  for (const result of searchLearningContent(`${question} ${context.title}`).slice(0, 8)) {
    add({
      id: result.id,
      title: result.title,
      href: result.href,
      type: result.type,
      excerpt: result.summary,
    })
    if (results.length >= 5) break
  }
  if (results.length === 0) {
    add(sourceById('ayurveda-basics'))
    add(sourceById('nature-and-current-balance'))
  }
  return results.slice(0, 5)
}

export function isKnownCitation(citation: ChatCitation) {
  const known = sourceById(citation.id)
  return Boolean(known && known.type === citation.type && known.href === citation.href)
}

function sourceById(id: string): ChatSourceExcerpt | null {
  const article = getLearningArticle(id)
  if (article) {
    return {
      id: article.id,
      title: article.title,
      href: `/learn/${article.id}`,
      type: 'article',
      excerpt: article.summary,
    }
  }
  const glossary = getGlossaryEntries().find((item) => item.id === id)
  if (glossary) {
    return {
      id: glossary.id,
      title: glossary.term,
      href: `/learn/glossary#${glossary.id}`,
      type: 'glossary',
      excerpt: glossary.definition,
    }
  }
  const recommendation = getRecommendations().find((item) => item.id === id)
  if (recommendation) {
    return {
      id: recommendation.id,
      title: recommendation.title,
      href: '/today',
      type: 'recommendation',
      excerpt: recommendation.rationale,
    }
  }
  const produce = seasonalProduceCatalog.find((item) => item.id === id)
  if (produce) {
    return {
      id: produce.id,
      title: produce.name,
      href: '/today',
      type: 'seasonal-food',
      excerpt: `${produce.name} has regional month and dietary eligibility in the local catalog.`,
    }
  }
  return null
}
