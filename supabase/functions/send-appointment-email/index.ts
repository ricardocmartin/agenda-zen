import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    // Return a 200 response for CORS preflight requests
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

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
    return new Response('Erro ao enviar e-mail', { status: 500, headers: corsHeaders })
  }

  return new Response('OK', { headers: corsHeaders })
})
