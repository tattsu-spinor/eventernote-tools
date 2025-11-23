import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_, next) => {
  const rewriter = new HTMLRewriter().on('a[href^="https://"]', {
    element: (element) => {
      element.setAttribute('target', '_blank');
      const relValue = element.getAttribute('rel') ?? '';
      if (!relValue.includes('noreferrer')) {
        element.setAttribute('rel', `${relValue} noreferrer`.trim());
      }
    },
  });
  const response = await next();
  return new Response(rewriter.transform(await response.text()), {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
});
