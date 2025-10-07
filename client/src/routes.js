import Index from './views/Index.svelte';
import Layout from './views/Layout.svelte';
import CatMaps from './views/CatMaps.svelte';
const routes = [
  {
    name: '/',
    component: Index,
    layout: Layout,
  },
  {
    name: '/map',
    component: CatMaps,
    layout: Layout,
  },
];

export { routes };
