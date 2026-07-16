export function birthYearBounds(now = new Date()) {
  const year = now.getFullYear()
  return { minimum: year - 120, maximum: year - 18 }
}

export function birthYearError(value: string, now = new Date()) {
  if (!value) return ''
  const { minimum, maximum } = birthYearBounds(now)
  return /^\d{4}$/.test(value) && Number(value) >= minimum && Number(value) <= maximum
    ? ''
    : `Enter a year from ${minimum} to ${maximum}, or leave it blank.`
}

export function birthYearInput(value: string) {
  return value.replace(/\D/g, '').slice(0, 4)
}
