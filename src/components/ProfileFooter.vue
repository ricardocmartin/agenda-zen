<template>
  <footer v-if="profile" class="bg-gray-100 py-6">
    <div class="max-w-5xl mx-auto px-4 text-center space-y-2">
      <div class="space-x-4 text-blue-600">
        <a v-if="profile.instagram" :href="profile.instagram" class="hover:underline">Instagram</a>
        <a v-if="profile.facebook" :href="profile.facebook" class="hover:underline">Facebook</a>
        <a v-if="profile.youtube" :href="profile.youtube" class="hover:underline">YouTube</a>
        <a v-if="profile.x" :href="profile.x" class="hover:underline">X (Twitter)</a>
      </div>
      <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} {{ profile.business_name }}</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ProfileFooter',
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
}
</script>
