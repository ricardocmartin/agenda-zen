// Smoke test for Sidebar.vue
// Verifica se o título do menu lateral é exibido
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from '../Sidebar.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('Sidebar', () => {
  it('renders brand title', () => {
    const { getByText } = render(Sidebar, { props: { isOpen: true }, global: { stubs: ['router-link'] } })
    expect(getByText('Agenda Zen')).toBeTruthy()
  })
})
