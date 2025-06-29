import { supabase } from '../supabase'
import { loggedScreenNames } from '../router'

let cache = null

export async function canView(screen) {
  if (cache === null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      cache = {}
    } else {
      const { data } = await supabase
        .from('screen_permissions')
        .select('screen, can_view')
        .eq('profile_id', user.id)
      cache = {}
      if (data) {
        data.forEach(p => { cache[p.screen] = p.can_view })
      }
    }
  }
  if (cache[screen] === false && loggedScreenNames.includes(screen)) return false
  return true
}

export function resetPermissionsCache() {
  cache = null
}
