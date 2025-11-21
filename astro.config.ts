import solidJs from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://eventernote-tools.vercel.app',
  adapter: vercel(),
  session: {
    driver: 'vercel-runtime-cache',
    options: {
      ttl: 600,
      tags: ['eventernote-tools'],
    },
  },
  integrations: [
    // https://starlight.astro.build/ja/reference/configuration/
    starlight({
      title: 'Eventernote Tools',
      tableOfContents: false,
      sidebar: [
        'coacting-events',
        'attended-events',
        'attendance-statistics',
        'appearance-statistics',
      ],
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
      pagination: false,
      components: {
        Head: './src/overrides/Head.astro',
        PageFrame: './src/overrides/PageFrame.astro',
      },
    }),
    solidJs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
