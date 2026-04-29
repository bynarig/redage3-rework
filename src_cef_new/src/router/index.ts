import { createRouter, createWebHashHistory } from 'vue-router'

// RAGE MP CEF loads pages via file:// — HTML5 pushState history does not work.
// Hash-based routing is required.
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router
