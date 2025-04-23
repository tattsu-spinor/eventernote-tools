import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
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
      pagination: false,
    }),
    vue(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
