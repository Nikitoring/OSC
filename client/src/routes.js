
import Index from './views/Index.svelte'
import Layout from './views/Layout.svelte'

const routes = [
  {
    name: '/',
    component: Index,
    layout: Layout
  },
  // { name: '/catmaps', component: Login, layout: Layout },
]

export { routes }