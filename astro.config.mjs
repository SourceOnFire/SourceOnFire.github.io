// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
//theme: 'material-theme-darker',
// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), sitemap()],
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      theme: 'laserwave',
    },
  },
  site: "https://SourceOnFire.github.io",
  
});
