import { render, waitFor } from '@testing-library/vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'

let role: string

function mockModules() {
  vi.doMock('../../router', () => ({
    loggedScreenNames: []
  }))

  vi.doMock('../../supabase', () => ({
    supabase: {
      from: (table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockImplementation(() => Promise.resolve({ data: { role }, error: null }))
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
}

async function renderSidebar() {
  const Sidebar = (await import('../Sidebar.vue')).default
  return render(Sidebar, {
    props: { isOpen: true },
    global: {
      stubs: {
        'router-link': { template: '<a><slot /></a>' }
      }
    }
  })
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.resetModules()
    mockModules()
  })

  it('renders brand title', async () => {
    role = 'admin'
    const { getByText } = await renderSidebar()
    expect(getByText('Agenda Zen')).toBeTruthy()
  })

  it('hides section when no access', async () => {
    role = 'user'
    const { findAllByText, queryByText } = await renderSidebar()
    await findAllByText('Agenda Zen')
    await waitFor(() => {
      expect(queryByText('Cadastros')).toBeNull()
    })
  })
})
