import Index from './views/Index.svelte';
import Layout from './views/Layout.svelte';
import Maps from './views/Map.svelte';
const routes = [
  {
    name: '/',
    component: Index,
    layout: Layout,
  },
  {
    name: '/map',
    component: Maps,
    layout: Layout,
  },
];

export { routes };
