// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@formkit/nuxt", "@nuxtjs/tailwindcss"],
  formkit: {
    autoImport: true
  },
  vite: {
    build: {
      minify: false
    }
  },
  ssr: false
})