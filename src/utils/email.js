import { supabase } from '../supabase'

export async function sendAppointmentEmail(details) {
  const { error } = await supabase.functions.invoke('send-appointment-email', {
    body: details
  })
  if (error) {
    console.error('Erro ao enviar email de agendamento:', error.message)
  } else {
    alert('E-mail enviado com sucesso!')
  }
}
