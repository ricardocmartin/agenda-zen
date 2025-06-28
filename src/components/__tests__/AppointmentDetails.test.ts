// Smoke test for AppointmentDetails.vue
// Garante que o componente renderiza e mostra informações básicas do agendamento
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import AppointmentDetails from '../AppointmentDetails.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('AppointmentDetails', () => {
  it('renders appointment info', () => {
    const appointment = { id: 1, date: '2025-01-01', time: '10:00', client_id: 1, service_id: 1, duration: 30, description: 'Teste' }
    const { getByText } = render(AppointmentDetails, {
      props: {
        appointment,
        getClientName: () => 'Cliente 1',
        getServiceName: () => 'Serviço 1',
        getRoomName: () => 'Sala 1',
        getRoomLink: () => 'https://meet.google.com/test'
      },
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' }
        }
      }
    })
    expect(getByText('Detalhes do Agendamento')).toBeTruthy()
    expect(getByText('Cliente:')).toBeTruthy()
    expect(getByText('Cliente 1')).toBeTruthy()
  })
})
