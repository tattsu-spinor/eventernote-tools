for (const element of document.querySelectorAll('a[href^="https://"]')) {
  element.setAttribute('target', '_blank');
  const relValue = element.getAttribute('rel') ?? '';
  if (!relValue.includes('noreferrer')) {
    element.setAttribute('rel', `${relValue} noreferrer`.trim());
  }
}
