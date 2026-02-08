import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import UnoCSS from '@unocss/astro';

export default defineConfig({
  integrations: [
    mdx(),
    sitemap(),
    UnoCSS({ injectReset: false }),
  ],
  site: 'https://haizipoemes.netlify.app',
});
