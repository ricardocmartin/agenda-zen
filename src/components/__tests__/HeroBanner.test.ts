// Smoke test for HeroBanner.vue
// Confirma que o texto principal é exibido
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import HeroBanner from '../HeroBanner.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('HeroBanner', () => {
  it('renders call to action', () => {
    const { getByText } = render(HeroBanner, {
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' }
        }
      }
    })
    expect(getByText(/agenda online que trabalha por você/i)).toBeTruthy()
    expect(getByText('Crie sua agenda gratuita')).toBeTruthy()
  })
})
