import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./docs/**/*.vue"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
} satisfies Config;
