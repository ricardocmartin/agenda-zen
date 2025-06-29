// Smoke test for Sidebar.vue
// Verifica se o título do menu lateral é exibido
import { render, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'

let role = 'admin'

vi.mock('../../supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockImplementation(() =>
            Promise.resolve({ data: { role }, error: null })
          )
        }
      }
      if (table === 'screen_permissions') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null })
        }
      }
      return { select: vi.fn(), eq: vi.fn(), single: vi.fn() }
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }),
      signOut: vi.fn()
    }
  }
}))

vi.mock('../../router/index.js', () => ({
  loggedScreenNames: []
}))

describe('Sidebar', () => {
  it('renders brand title', async () => {
    const Sidebar = (await import('../Sidebar.vue')).default
    const { getByText } = render(Sidebar, { props: { isOpen: true }, global: { stubs: ['router-link'] } })
    expect(getByText('Agenda Zen')).toBeTruthy()
  })

  it('hides section when no access', async () => {
    role = 'user'
    vi.resetModules()
    const Sidebar = (await import('../Sidebar.vue')).default
    const { findAllByText, queryByText } = render(Sidebar, {
      props: { isOpen: true },
      global: { stubs: ['router-link'] }
    })
    await findAllByText('Agenda Zen')
    await waitFor(() => {
      expect(queryByText('Cadastros')).toBeNull()
    })
  })
})
