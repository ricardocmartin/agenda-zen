<template>
  <router-view />
  <CookieBanner />
</template>

<script>
import CookieBanner from './components/CookieBanner.vue'

export default {
  name: 'App',
  components: { CookieBanner }
}
</script>