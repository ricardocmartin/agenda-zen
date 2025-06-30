<template>
  <Navbar />
  <HeroBanner />
  <FeaturesSection />
  <TestimonialsSection />
  <AudienceSection />
  <PricingSection />
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import HeroBanner from '../components/HeroBanner.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import AudienceSection from '../components/AudienceSection.vue'
import PricingSection from '../components/PricingSection.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Navbar,
    HeroBanner,
    FeaturesSection,
    TestimonialsSection,
    AudienceSection,
    PricingSection,
    Footer
  }
}
</script>
