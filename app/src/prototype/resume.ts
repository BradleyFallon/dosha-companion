import { getAssessmentQuestions } from '../quiz/assessment'
import type { PrototypeState } from './state'
import { getProfileReadiness } from '../profile/readiness'

export function nextResumePath(state: PrototypeState) {
  const readiness = getProfileReadiness(state.profile)
  if (!readiness.nameReady) return '/profile/name'
  if (!readiness.locationReady) return '/profile/location'
  if (!readiness.foodReady || !state.profileCompleted) return '/profile/food'
  if (!state.assessmentStarted) return '/assessment'
  if (state.resultsReached) return state.todayVisited ? '/today' : '/results'
  const questions = getAssessmentQuestions(state.assessmentMode)
  return `/assessment/question/${questions[state.currentIndex]?.id ?? questions[0]?.id}`
}
