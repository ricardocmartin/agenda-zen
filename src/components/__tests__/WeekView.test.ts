// Smoke test for WeekView.vue
// Checa se a grade semanal é exibida com os dias da semana
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import WeekView from '../WeekView.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('WeekView', () => {
  it('renders day labels', () => {
    const { getByText } = render(WeekView, {
      props: { appointments: [], getClientName: () => 'Cliente' },
      global: { stubs: ['router-link'] }
    })
    expect(getByText('Seg')).toBeTruthy()
    expect(getByText('Dom')).toBeTruthy()
  })
})
