import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://voxelka.ru',
  integrations: [
    tailwind(),
    preact()
  ]
});
