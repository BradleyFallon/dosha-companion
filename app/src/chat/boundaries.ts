import type { ChatApiResponse } from './api'

export function deterministicBoundaryResponse(message: string): ChatApiResponse | null {
  if (/(suicid|kill myself|can['’]?t breathe|chest pain|medical emergency)/i.test(message)) {
    return {
      answer: 'This may need immediate, real-world help. Contact local emergency services or a qualified crisis service now; this educational app cannot respond to emergencies.',
      citations: [],
      suggestedFollowUps: [],
      boundary: 'emergency',
    }
  }
  if (/(stop|start|change|skip).{0,30}(medication|medicine|prescription)|medication.{0,30}(stop|change)/i.test(message)) {
    return {
      answer: 'Do not start, stop, or change medication based on this app. A prescribing clinician or pharmacist can help you make that decision safely.',
      citations: [],
      suggestedFollowUps: [],
      boundary: 'medication',
    }
  }
  if (/(do i have|diagnos|treat|cure).{0,40}(disorder|infection|disease|anxiety|condition)|treat an infection/i.test(message)) {
    return {
      answer: 'Dosha Companion cannot diagnose or treat a medical or mental-health condition. Please ask a qualified clinician for an assessment or treatment advice.',
      citations: [],
      suggestedFollowUps: ['What educational wellness topics can you explain?'],
      boundary: 'medical',
    }
  }
  return null
}
