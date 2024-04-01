import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./docs/**/*.{html,js,ts,md}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
