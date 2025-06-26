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

export function addHoursToTime(timeStr, hours = 1) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setHours(h)
  date.setMinutes(m)
  date.setSeconds(0)
  date.setMinutes(date.getMinutes() + hours * 60)
  const newH = String(date.getHours()).padStart(2, '0')
  const newM = String(date.getMinutes()).padStart(2, '0')
  return `${newH}:${newM}`
}

export function addDays(dateStr, days = 1) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
