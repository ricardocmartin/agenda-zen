// Smoke test for Footer.vue
// Verifica se o rodapé exibe texto de direitos reservados
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Footer from '../Footer.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('Footer', () => {
  it('renders copyright', () => {
    const { getByText } = render(Footer, { global: { stubs: ['router-link'] } })
    expect(getByText(/Agenda Zen.*direitos reservados/)).toBeTruthy()
  })
})
