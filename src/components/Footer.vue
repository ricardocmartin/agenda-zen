<template>
  <footer class="bg-gray-100 text-sm text-gray-600 border-t">
    <div class="container mx-auto px-8 py-10 grid gap-8 md:grid-cols-4">
      <div>
        <router-link to="/" class="text-xl font-semibold text-primary-dark block mb-2">Agenda Zen</router-link>
        <p class="text-xs">Desenvolvido com ❤️ no Brasil</p>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Links</h3>
        <router-link to="/planos" class="block hover:underline">Planos</router-link>
        <router-link to="/faq" class="block hover:underline">FAQ</router-link>
        <router-link to="/contato" class="block hover:underline">Contato</router-link>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Legal</h3>
        <router-link to="/termos-de-uso" class="block hover:underline">Termos de uso</router-link>
        <router-link to="/politica-de-privacidade" class="block hover:underline">Privacidade</router-link>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Redes</h3>
        <div class="space-y-1">
          <a href="https://www.instagram.com/agendazen_" target="_blank" class="block hover:underline">Instagram</a>
          <a href="https://www.facebook.com/agenda.zen" target="_blank" class="block hover:underline">Facebook</a>
          <a href="https://x.com/agenda_zen" target="_blank" class="block hover:underline">X</a>
          <a href="https://wa.me/5531999999999" target="_blank" class="block hover:underline inline-flex items-center">
            <img src="/icons/whatsapp.svg" alt="WhatsApp" class="w-4 h-4 mr-1" />WhatsApp
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default { name: 'Footer' }
</script>
