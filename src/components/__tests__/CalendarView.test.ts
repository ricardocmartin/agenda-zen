// Smoke test for CalendarView.vue
// Verifica renderização básica e presença do cabeçalho de dias
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import CalendarView from '../CalendarView.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('CalendarView', () => {
  it('renders days of week', () => {
    const { getByText } = render(CalendarView, {
      props: { appointments: [], getClientName: () => 'Cliente' },
      global: { stubs: ['router-link'] }
    })
    expect(getByText('Seg')).toBeTruthy()
    expect(getByText('Dom')).toBeTruthy()
  })
})
