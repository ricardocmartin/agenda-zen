import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Permissoes from '../Permissoes.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      insert: vi.fn().mockResolvedValue({ data: {}, error: null })
    }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }) }
  }
}))

describe('Permissoes view', () => {
  it('renders screen field', () => {
    const { getByLabelText } = render(Permissoes, { global: { stubs: ['router-link'] } })
    expect(getByLabelText('Tela')).toBeTruthy()
  })
})
