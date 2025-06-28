// Smoke test for Modal.vue
// Verifica se o slot é renderizado corretamente
import { render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import Modal from '../Modal.vue'

vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } } }), signOut: vi.fn() }
  }
}))

describe('Modal', () => {
  it('renders slot content', () => {
    const { getByText } = render(Modal, {
      slots: { default: '<p>Conteudo do Modal</p>' },
      global: { stubs: ['router-link'] }
    })
    expect(getByText('Conteudo do Modal')).toBeTruthy()
  })
})
