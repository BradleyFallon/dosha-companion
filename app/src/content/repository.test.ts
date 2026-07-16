import { describe, expect, it } from 'vitest'
import { getCheckInQuestionSets, getGlossaryEntries, getLearningArticle, getLearningArticles, getRecommendations, searchLearningContent } from './repository'

describe('content repository', () => {
  it('loads the validated published catalogs', () => {
    expect(getLearningArticles()).toHaveLength(9)
    expect(getRecommendations().length).toBeGreaterThanOrEqual(12)
    expect(getGlossaryEntries()).toHaveLength(8)
    expect(getCheckInQuestionSets()).toHaveLength(2)
  })

  it('loads article detail and searches across content types', () => {
    expect(getLearningArticle('vata')?.title).toBe('Vata')
    const results = searchLearningContent('What is Vata?')
    expect(results.some((result) => result.href === '/learn/vata')).toBe(true)
    expect(results.some((result) => result.type === 'glossary')).toBe(true)
  })

  it('returns no matches for an empty or unrelated query', () => {
    expect(searchLearningContent('')).toEqual([])
    expect(searchLearningContent('xylophone')).toEqual([])
  })
})
