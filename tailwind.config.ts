import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./{components,docs}/**/*.{html,js,ts,md,vue}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
} satisfies Config;
