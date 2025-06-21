import cloudflare from '@astrojs/cloudflare';
import solidJs from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [
    // https://starlight.astro.build/ja/reference/configuration/
    starlight({
      title: 'Eventernote Tools',
      tableOfContents: false,
      sidebar: ['coacting-events', 'appearance-statistics'],
      locales: {
        root: {
          label: '日本語',
          lang: 'ja',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/tattsu-spinor/eventernote-tools',
        },
        {
          icon: 'twitter',
          label: 'Twitter',
          href: 'https://twitter.com/Tattsu_dagaya_',
        },
      ],
      customCss: ['./src/styles/global.css'],
      markdown: {
        headingLinks: false,
      },
      pagefind: false,
      head: [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: '/external-link.js',
          },
        },
      ],
      pagination: false,
    }),
    solidJs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
