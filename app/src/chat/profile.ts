import type { PrototypeState } from '../prototype/state'
import type { ResolvedChatContext, SafeProfileContext } from './types'

export function buildSafeProfileContext(
  state: PrototypeState,
  context: ResolvedChatContext,
): SafeProfileContext {
  const safe: SafeProfileContext = {}
  if (state.profile.preferredName) safe.preferredName = state.profile.preferredName

  if (context.reference.type === 'seasonal-food') {
    if (state.profile.dietaryPattern) safe.dietaryPattern = state.profile.dietaryPattern
    const allergies = splitList(state.profile.allergies)
    const exclusions = splitList(state.profile.exclusions)
    if (allergies.length) safe.allergies = allergies
    if (exclusions.length) safe.exclusions = exclusions
  }
  if (context.reference.type === 'seasonal-food' && state.profile.location) {
    safe.regionalLocationLabel = state.profile.location.displayName
  }
  if (context.payload.type === 'recommendation') {
    safe.currentRecommendationTitle = context.payload.title
  }
  if (context.payload.type === 'check-in') {
    safe.recentCheckInSummary = `${context.payload.answers.length} current-balance answers completed ${context.payload.completedAt.slice(0, 10)}`
  }
  return safe
}

function splitList(value: string) {
  return value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 20)
}
