// Smoke test for AboutSection.vue
// Verifica se o componente renderiza e exibe o título principal
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import AboutSection from '../AboutSection.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('AboutSection', () => {
  it('renders section title', () => {
    const { getByText } = render(AboutSection, { global: { stubs: ['router-link'] } })
    expect(getByText('O que é o Agenda Zen?')).toBeTruthy()
  })
})
