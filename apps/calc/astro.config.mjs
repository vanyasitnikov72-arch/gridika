import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://calc.temka.local',
  integrations: [
    preact(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
});
