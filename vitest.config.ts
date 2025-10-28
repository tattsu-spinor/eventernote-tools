/// <reference types="vitest/config" />
import { playwright } from '@vitest/browser-playwright';
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
    },
  },
});
