import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Empresa from '../Empresa.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      update: vi.fn()
    }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) }
  }
}))

describe('Empresa view', () => {
  it('renders company name field', () => {
    const { getByLabelText } = render(Empresa, { global: { stubs: ['router-link'] } })
    expect(getByLabelText('Nome da Empresa')).toBeTruthy()
  })
})
