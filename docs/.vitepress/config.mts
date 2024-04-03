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
    sidebar: [{ text: "共演イベント検索", link: "/coacting-events" }],
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
