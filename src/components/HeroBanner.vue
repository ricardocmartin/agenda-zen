<template>
    <section class="text-center py-20">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div>
            <h1 class="text-4xl font-bold text-blue-800 mb-4">Sua agenda digital simples e profissional</h1>
            <p class="text-gray-600 text-lg mb-6">Perfeita para psicólogos, terapeutas, dentistas, cabeleireiros e mais</p>
            <div class="space-x-4">
              <a href="#" class="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100">Entrar</a>
              <a href="/#/cadastro" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Criar conta</a>
            </div>
          </div>
          <div>
            <img src="/hero-illustration.png" alt="Ilustração profissional usando a plataforma" class="w-full h-auto max-w-md mx-auto">
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default { name: 'HeroBanner' }
  </script>