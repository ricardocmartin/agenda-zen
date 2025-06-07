<template>
    <nav class="flex items-center justify-between px-8 py-4 bg-white shadow">
        <router-link to="/" class="text-xl font-bold text-blue-600">Agenda Zen</router-link>
        <div class="flex items-center space-x-4">
        <router-link to="/buscar" class="text-blue-600 hover:underline">Buscar</router-link>
        <router-link to="/planos" class="text-blue-600 hover:underline">Planos</router-link>
        <router-link to="/contato" class="text-blue-600 hover:underline">Contato</router-link>
        <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
        <router-link to="/cadastro" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Cadastre-se</router-link>
        </div>
    </nav>
</template>