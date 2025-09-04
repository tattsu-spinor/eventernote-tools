import solidJs from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://eventernote-tools.tattsu.workers.dev',
  adapter: vercel(),
  integrations: [
    // https://starlight.astro.build/ja/reference/configuration/
    starlight({
      title: 'Eventernote Tools',
      tableOfContents: false,
      sidebar: ['coacting-events', 'attended-events', 'appearance-statistics'],
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
        Head: './src/components/overrides/Head.astro',
        PageFrame: './src/components/overrides/PageFrame.astro',
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
