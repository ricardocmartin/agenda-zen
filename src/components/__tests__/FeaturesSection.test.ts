// Smoke test for FeaturesSection.vue
// Garante que o título "Funcionalidades" é exibido
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import FeaturesSection from '../FeaturesSection.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('FeaturesSection', () => {
  it('renders feature title', () => {
    const { getByText } = render(FeaturesSection, { global: { stubs: ['router-link'] } })
    expect(getByText('Funcionalidades')).toBeTruthy()
  })
})
