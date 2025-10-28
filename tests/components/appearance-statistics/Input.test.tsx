import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { Input } from '../../../src/components/coacting-events/Input';

test('出演数統計_入力検証', async () => {
  const { searchButton } = setup();

  // 初期状態
  await expect.element(searchButton).toBeDisabled();
});

const setup = () => {
  window.localStorage.clear();
  const { baseElement } = render(() => <Input />);
  const screen = page.elementLocator(baseElement);
  return {
    searchButton: screen.getByRole('button', { name: '検索' }),
  } as const;
};
