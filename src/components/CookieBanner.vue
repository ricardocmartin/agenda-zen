<template>
  <div
    v-if="!consentGiven"
    class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center z-50"
  >
    <p class="mb-2">
      Utilizamos cookies para melhorar sua experiência. Ao continuar, você
      concorda com nossa
      <a href="#" class="underline">política de privacidade</a>.
    </p>
    <button
      @click="acceptCookies"
      class="btn"
    >
      Aceitar
    </button>
  </div>
</template>

<script>
export default {
  name: 'CookieBanner',
  data() {
    return {
      consentGiven: false
    }
  },
  mounted() {
    this.consentGiven = localStorage.getItem('cookieConsent') === 'true'
  },
  methods: {
    acceptCookies() {
      this.consentGiven = true
      localStorage.setItem('cookieConsent', 'true')
    }
  }
}
</script>
