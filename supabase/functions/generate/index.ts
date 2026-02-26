import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { type, userData, userQuestion, costStars } = await req.json()

  // 1. Setup do cliente Supabase com Service Role (Privilegiado)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE') ?? ''
  )

  // 2. Valida o Token do Usuário (Segurança)
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) return new Response("Não autorizado", { status: 401 })

  // 3. Chamada ao Gemini (API Key fica protegida no servidor)
  const googleKey = Deno.env.get('GOOGLE_API_KEY')
  const prompt = `Atue como o Oráculo Evolgeist. Tipo: ${type}. Usuário: ${userData.full_name}, Signo: ${userData.zodiac}. Pergunta: ${userQuestion}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`, {
    method: 'POST',
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  })

  const aiData = await response.json()
  const aiText = aiData.candidates[0].content.parts[0].text

  // 4. Chama o RPC que criamos acima para cobrar e salvar
  const { data, error: rpcError } = await supabase.rpc('debit_stars_and_create_reading', {
    p_user_id: user.id,
    p_cost: costStars,
    p_type: type,
    p_content: aiText
  })

  if (rpcError) return new Response(JSON.stringify(rpcError), { status: 400 })

  return new Response(JSON.stringify({ text: aiText }), {
    headers: { "Content-Type": "application/json" },
  })
})