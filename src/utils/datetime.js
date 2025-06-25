export function getBrazilNow() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  )
}

export function parseBrazilDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  )
  const iso = `${dateStr}T${timeStr}`
  return new Date(
    new Date(iso).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  )
}
