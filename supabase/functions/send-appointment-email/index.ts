import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async req => {
  const { to, subject, text } = await req.json()

  const apiKey = Deno.env.get('RESEND_API_KEY')
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'no-reply@agenda-zen.com',
      to,
      subject,
      text
    })
  })

  if (!resp.ok) {
    const err = await resp.text()
    console.error(err)
    return new Response('Erro ao enviar e-mail', { status: 500 })
  }

  return new Response('OK')
})
