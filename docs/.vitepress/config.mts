import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Eventernote Tools",
  description: "Eventernoteの高度な検索を提供するサイト",
  lang: "ja",
  cleanUrls: true,
  appearance: "force-dark",
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
});
