export function cpfMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 9)
  const part4 = digits.slice(9, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${part1}.${digits.slice(3)}`
  if (digits.length <= 9) return `${part1}.${part2}.${digits.slice(6)}`
  return `${part1}.${part2}.${part3}-${part4}`
}

export function cepMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const part1 = digits.slice(0, 5)
  const part2 = digits.slice(5)
  if (digits.length <= 5) return digits
  return `${part1}-${part2}`
}

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const [year, month, day] = parts
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}
