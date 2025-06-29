import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Signup from '../Signup.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }) }) }) }),
    auth: { signUp: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) }
  }
}))

describe('Signup view', () => {
  it('renders company field', () => {
    const { getByLabelText } = render(Signup, { global: { stubs: ['router-link'] } })
    expect(getByLabelText('Empresa')).toBeTruthy()
  })
})
