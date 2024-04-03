import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Eventernote Tools",
  lang: "ja",
  cleanUrls: true,
  appearance: "force-dark",
  vite: {
    server: {
      proxy: {
        "/actors/": {
          target: "https://www.eventernote.com",
          changeOrigin: true,
        },
      },
    },
  },
  themeConfig: {
    sidebar: [
      { text: "共演者検索", link: "/coacting-events" },
      { text: "Markdown Examples", link: "/markdown-examples" },
      { text: "Runtime API Examples", link: "/api-examples" },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/tattsu-spinor/eventernote-tools",
      },
      {
        icon: "twitter",
        link: "https://twitter.com/Tattsu_dagaya_",
      },
    ],
  },
});
