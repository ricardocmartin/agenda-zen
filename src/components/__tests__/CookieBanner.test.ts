// Smoke test for CookieBanner.vue
// Confere se o banner exibe mensagem e botão de aceitar cookies
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import CookieBanner from '../CookieBanner.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('CookieBanner', () => {
  it('renders message and button', () => {
    const { getByText } = render(CookieBanner, { global: { stubs: ['router-link'] } })
    expect(getByText(/Utilizamos cookies/i)).toBeTruthy()
    expect(getByText('Aceitar')).toBeTruthy()
  })
})
