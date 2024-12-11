import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
  content: ['./docs/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['dark'],
  },
} satisfies Config;
