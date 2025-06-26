export function phoneMask(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11)
  const ddd = digits.slice(0, 2)

  if (digits.length <= 2) {
    return digits ? `(${ddd}` : ''
  }

  if (digits.length <= 6) {
    const part = digits.slice(2)
    return `(${ddd}) ${part}`
  }

  if (digits.length <= 10) {
    const part2 = digits.slice(2, 6)
    const part3 = digits.slice(6)
    return `(${ddd}) ${part2}${part3 ? `-${part3}` : ''}`
  }

  const part2 = digits.slice(2, 7)
  const part3 = digits.slice(7)
  return `(${ddd}) ${part2}-${part3}`
}

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}
