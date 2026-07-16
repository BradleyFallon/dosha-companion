export const locationReturnTargets = {
  today: '/today',
  settings: '/settings',
  learn: '/learn',
  balance: '/balance',
} as const

export type LocationReturnPath = (typeof locationReturnTargets)[keyof typeof locationReturnTargets]

export function locationEntryPath(returnTo: LocationReturnPath) {
  const entry = Object.entries(locationReturnTargets).find(([, path]) => path === returnTo)
  if (!entry) return '/profile/location'
  return `/profile/location?return=${entry[0]}`
}

export function locationReturnPath(search: string, fallback: string) {
  const key = new URLSearchParams(search).get('return')
  return key && key in locationReturnTargets
    ? locationReturnTargets[key as keyof typeof locationReturnTargets]
    : fallback
}
