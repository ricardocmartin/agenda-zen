// Smoke test for HeaderUser.vue
// Garante que o cabeçalho do usuário mostra o título e o nome
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import HeaderUser from '../HeaderUser.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com', user_metadata: {} } } }),
      signOut: vi.fn()
    }
  }
}))

vi.mock('../../utils/permissions', () => ({
  canView: vi.fn().mockResolvedValue(true)
}))

describe('HeaderUser', () => {
  it('renders title and user name', async () => {
    const routerMock = { push: vi.fn() }
    const { findByText } = render(HeaderUser, {
      props: { title: 'Dashboard' },
      global: { stubs: ['router-link'], mocks: { $router: routerMock } }
    })
    expect(await findByText('Dashboard')).toBeTruthy()
    expect(await findByText('test@example.com')).toBeTruthy()
  })
})
