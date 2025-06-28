<template>
  <footer class="bg-gray-100 text-center text-sm text-gray-500 py-6 space-y-4 border-t">
    <div class="space-x-4 text-primary">
      <a href="https://www.instagram.com/agendazen_" target="_blank" class="hover:underline">Instagram</a>
      <a href="https://www.facebook.com/agenda.zen" target="_blank" class="hover:underline">Facebook</a>
      <a href="https://x.com/agenda_zen" target="_blank" class="hover:underline">X</a>
    </div>
    <div class="flex flex-wrap justify-center space-x-2">
      <router-link to="/termos-de-uso" class="hover:underline">Termos de uso</router-link>
      <span>|</span>
      <router-link to="/planos" class="hover:underline">Planos</router-link>
      <span>|</span>
      <router-link to="/contato" class="hover:underline">Contato</router-link>
      <span>|</span>
      <router-link to="/faq" class="hover:underline">FAQ</router-link>
      <span>|</span>
      <router-link to="/politica-de-privacidade" class="hover:underline">Política de privacidade</router-link>
    </div>
    <p>© 2025 Agenda Zen — Todos os direitos reservados</p>
  </footer>
</template>

<script>
export default { name: 'Footer' }
</script>
