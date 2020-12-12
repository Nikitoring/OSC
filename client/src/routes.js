
import Index from './views/Index.svelte'
import Layout from './views/Layout.svelte'
import Maps from './views/Maps.svelte'
const routes = [
  {
    name: '/',
    component: Index,
    layout: Layout
  },
  { name: '/catmaps', component: Maps, layout: Layout },
]

export { routes }