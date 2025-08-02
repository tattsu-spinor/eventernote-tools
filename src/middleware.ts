import { defineMiddleware } from 'astro:middleware';
import { parseHTML } from 'linkedom';

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  const { document } = parseHTML(await response.text());
  document.querySelectorAll('a[href^="https://"]').forEach((element) => {
    element.setAttribute('target', '_blank');
    const relValue = element.getAttribute('rel') ?? '';
    if (!relValue.includes('noreferrer')) {
      element.setAttribute('rel', `${relValue} noreferrer`.trim());
    }
  });

  return new Response(document.toString(), {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
});
