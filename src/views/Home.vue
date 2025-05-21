<template>
  <Navbar />
  <HeroBanner />
  <FeaturesSection />
  <AboutSection />
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import HeroBanner from '../components/HeroBanner.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import AboutSection from '../components/AboutSection.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Navbar,
    HeroBanner,
    FeaturesSection,
    AboutSection,
    Footer
  }
}
</script>
