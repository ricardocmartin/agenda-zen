import { supabase } from '../supabase'

export async function getUserCompanyId(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single()
  return data ? data.company_id : null
}

export async function getCompanyUserIds(companyId) {
  if (!companyId) return []
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('company_id', companyId)
  return data ? data.map(p => p.id) : []
}
