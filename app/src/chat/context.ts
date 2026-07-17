import { getCheckInQuestionSet, getLearningArticle, getRecommendations } from '../content/repository'
import { selectDailyRecommendation } from '../content/recommendations'
import { getSeasonalProduce } from '../content/seasonalProduce'
import { initialAssessment } from '../generated/initialAssessment'
import { calculateAssessmentCoverage } from '../quiz/coverage'
import { isBalanceDomain } from '../balance/domains'
import { buildBalanceViewModel, comparisonLabel } from '../balance/model'
import type { PrototypeState } from '../prototype/state'
import type {
  ChatContextReference,
  ResolvedChatContext,
} from './types'

export type {
  ChatContextPayload,
  ChatContextReference,
  ChatContextType,
  ResolvedChatContext,
} from './types'

export function resolveChatContext(
  reference: ChatContextReference,
  state: PrototypeState,
): ResolvedChatContext | null {
  switch (reference.type) {
    case 'recommendation':
      return resolveRecommendation(reference.id, state)
    case 'article':
      return resolveArticle(reference.id)
    case 'seasonal-food':
      return resolveSeasonalFood(reference.id, state)
    case 'check-in':
      return resolveCheckIn(reference.id, state)
    case 'balance-domain':
      return resolveBalanceDomain(reference.id, state)
    case 'general':
      return {
        reference: { type: 'general', id: 'general', sourcePath: safeGeneralSource(reference.sourcePath) },
        title: 'General conversation',
        subtitle: 'Ask Dosha Companion',
        summary: 'Ask about Ayurveda, Today guidance, check-ins, or the learning library.',
        sourcePath: safeGeneralSource(reference.sourcePath),
        suggestedQuestions: [
          'What is Vata?',
          'How do usual nature and current balance differ?',
          'Why was today’s recommendation chosen?',
        ],
        sourceIds: [],
        payload: { type: 'general' },
      }
  }
}

function resolveBalanceDomain(id: string, state: PrototypeState): ResolvedChatContext | null {
  if (!isBalanceDomain(id)) return null
  const domain = buildBalanceViewModel(state).domains.find((candidate) => candidate.id === id)
  if (!domain) return null
  return {
    reference: { type: 'balance-domain', id, sourcePath: `/balance/${id}` },
    title: domain.label,
    subtitle: 'My Balance',
    summary: `${domain.label}: ${comparisonLabel(domain.comparison).toLowerCase()}.`,
    sourcePath: `/balance/${id}`,
    suggestedQuestions: [
      'What changed here?',
      'How might I support this area?',
      'How does this relate to my usual pattern?',
    ],
    sourceIds: ['nature-and-current-balance', 'self-assessment'],
    payload: {
      type: 'balance-domain',
      domain: id,
      label: domain.label,
      usualAnswer: domain.usual?.fullText,
      recentAnswer: domain.recent?.fullText,
      usualShortLabel: domain.usual?.shortLabel,
      recentShortLabel: domain.recent?.shortLabel,
      comparison: domain.comparison,
    },
  }
}

function resolveRecommendation(id: string, state: PrototypeState): ResolvedChatContext | null {
  const item = getRecommendations().find((candidate) => candidate.id === id)
  if (!item) return null
  const coverage = calculateAssessmentCoverage({
    submittedAnswers: state.submittedAnswers,
    skippedQuestionIds: state.skippedQuestionIds,
  })
  const active = selectDailyRecommendation({
    coverage,
    profile: state.profile,
    submittedAnswers: state.submittedAnswers,
    recommendationHistory: state.recommendationHistory,
    activeRecommendationId: state.todayRecommendationId,
  })
  const reasons = active.id === id ? active.why : [item.rationale]
  return {
    reference: { type: 'recommendation', id, sourcePath: '/today' },
    title: item.title,
    subtitle: 'Today’s focus',
    summary: item.guidance,
    sourcePath: '/today',
    suggestedQuestions: [
      'Why was this recommended?',
      'How could I adapt this?',
      'What should I notice afterward?',
    ],
    sourceIds: [item.id, item.relatedArticleId],
    payload: {
      type: 'recommendation',
      recommendationId: item.id,
      title: item.title,
      guidance: item.guidance,
      action: item.action,
      reasons,
      relatedArticleId: item.relatedArticleId,
    },
  }
}

function resolveArticle(id: string): ResolvedChatContext | null {
  const article = getLearningArticle(id)
  if (!article) return null
  return {
    reference: { type: 'article', id, sourcePath: `/learn/${id}` },
    title: article.title,
    subtitle: 'Learning article',
    summary: article.summary,
    sourcePath: `/learn/${id}`,
    suggestedQuestions: [
      'Can you explain this more simply?',
      'How does this differ from current balance?',
      'How might this relate to daily routines?',
    ],
    sourceIds: [article.id, ...article.relatedArticleIds],
    payload: {
      type: 'article',
      articleId: article.id,
      title: article.title,
      summary: article.summary,
      body: article.body,
      tags: article.tags,
    },
  }
}

function resolveSeasonalFood(id: string, state: PrototypeState): ResolvedChatContext | null {
  const item = getSeasonalProduce(state.profile).find((candidate) => candidate.id === id)
  const location = state.profile.location
  if (!item || !location?.produceRegionId) return null
  return {
    reference: { type: 'seasonal-food', id, sourcePath: '/today' },
    title: item.name,
    subtitle: 'In season near you',
    summary: `${item.name} is listed for the current month in ${location.displayName}.`,
    sourcePath: '/today',
    suggestedQuestions: [
      'Why is this shown as seasonal?',
      'How could I prepare this simply?',
      'Does this fit my saved dietary preferences?',
    ],
    sourceIds: [item.id, item.articleId],
    payload: {
      type: 'seasonal-food',
      foodId: item.id,
      name: item.name,
      produceRegion: location.displayName,
      month: new Date().getMonth() + 1,
      dietaryPattern: state.profile.dietaryPattern,
      relatedArticleId: item.articleId,
    },
  }
}

function resolveCheckIn(id: string, state: PrototypeState): ResolvedChatContext | null {
  const checkIn = state.checkIns.find((candidate) => candidate.id === id && candidate.completedAt)
  const set = checkIn ? getCheckInQuestionSet(checkIn.setId) : null
  if (!checkIn?.completedAt || !set) return null
  const answers = set.questionIds.flatMap((questionId) => {
    const question = initialAssessment.questions.find((candidate) => candidate.id === questionId)
    const answer = question?.answers.find((candidate) => candidate.id === checkIn.answers[questionId])
    return question && answer ? [{ question: question.text, answer: answer.text }] : []
  })
  return {
    reference: { type: 'check-in', id, sourcePath: '/questions' },
    title: set.title,
    subtitle: `Completed ${formatDate(checkIn.completedAt)}`,
    summary: `${answers.length} recent answers saved separately from your usual-nature assessment.`,
    sourcePath: '/questions',
    suggestedQuestions: [
      'What changed from my usual pattern?',
      'What should I keep observing?',
      'How is this different from my assessment?',
    ],
    sourceIds: ['nature-and-current-balance', 'self-assessment'],
    payload: {
      type: 'check-in',
      checkInId: checkIn.id,
      completedAt: checkIn.completedAt,
      classification: 'current',
      answers,
    },
  }
}

function safeGeneralSource(path: string) {
  return ['/today', '/learn', '/questions', '/balance'].includes(path) ? path : '/today'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}
