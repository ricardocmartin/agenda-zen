export function formatPixField(id, value) {
  const len = String(value.length).padStart(2, '0')
  return `${id}${len}${value}`
}

export function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generatePixPayload({ key, name, city = 'SAO PAULO', amount, txid = 'AGENDAZEN' }) {
  const merchantAccount =
    formatPixField('00', 'BR.GOV.BCB.PIX') +
    formatPixField('01', key)

  const additionalData = formatPixField('05', txid)

  const payloadWithoutCrc =
    '000201' +
    '26' + String(merchantAccount.length).padStart(2, '0') + merchantAccount +
    '52040000' +
    '5303986' +
    (amount ? formatPixField('54', amount) : '') +
    '5802BR' +
    formatPixField('59', name) +
    formatPixField('60', city) +
    '62' + String(additionalData.length).padStart(2, '0') + additionalData +
    '6304'

  const crc = crc16(payloadWithoutCrc)
  return payloadWithoutCrc + crc
}
