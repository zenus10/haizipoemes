import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import UnoCSS from '@unocss/astro';

export default defineConfig({
  integrations: [
    mdx(),
    UnoCSS({ injectReset: false }),
  ],
  site: 'https://haizipoemes.netlify.app',
});
