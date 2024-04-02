import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Eventernote Tools",
  lang: "ja",
  base: "/eventernote-tools/",
  cleanUrls: true,
  appearance: {
    onChanged(isDark, defaultHandler, mode) {
      defaultHandler(mode);
      const html = document.querySelector("html")!;
      html.setAttribute("data-theme", isDark ? "dark" : "light");
    },
  },
  themeConfig: {
    sidebar: [
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
