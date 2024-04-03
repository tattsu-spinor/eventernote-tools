import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./components/**/*.vue"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
} satisfies Config;
