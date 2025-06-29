import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Configuracao from '../Configuracao.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      update: vi.fn(),
      upsert: vi.fn()
    }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('Configuracao view', () => {
  it('renders company name field', async () => {
    const { getByLabelText } = render(Configuracao, { global: { stubs: ['router-link'] } })
    expect(getByLabelText('Nome da Empresa')).toBeTruthy()
  })
})
