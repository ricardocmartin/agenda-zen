export function phoneMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const part1 = digits.slice(0, 2)
  const part2 = digits.slice(2, 6)
  const part3 = digits.slice(6, 10)
  if (digits.length > 6) {
    return `(${part1}) ${part2}-${part3}`
  } else if (digits.length > 2) {
    return `(${part1}) ${part2}`
  } else if (digits.length > 0) {
    return `(${part1}`
  }
  return ''
}

export function digitsOnly(value) {
  return value.replace(/\D/g, '')
}
