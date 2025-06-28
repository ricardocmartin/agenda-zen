// Smoke test for Navbar.vue
// Verifica se o menu principal é renderizado
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../Navbar.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('Navbar', () => {
  it('renders brand name', () => {
    const { getByText } = render(Navbar, { global: { stubs: ['router-link'] } })
    expect(getByText('Agenda Zen')).toBeTruthy()
  })
})
