// Smoke test for ProfileFooter.vue
// Garante que as informações do perfil são exibidas
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import ProfileFooter from '../ProfileFooter.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('ProfileFooter', () => {
  it('renders business name', () => {
    const profile = { business_name: 'Empresa X', instagram: 'http://insta.com' }
    const { getByText } = render(ProfileFooter, {
      props: { profile },
      global: { stubs: ['router-link'] }
    })
    expect(getByText(/Empresa X/)).toBeTruthy()
  })
})
