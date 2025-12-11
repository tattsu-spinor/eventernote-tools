import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from '../../../src/components/appearance-statistics/Input.svelte';

test('出演数統計_入力検証', async () => {
  const { searchButton, keywordTextBox } = setup();

  // 初期状態
  await expect.element(searchButton).toBeDisabled();

  // キーワード入力
  await keywordTextBox.fill('キーワード');
  await expect.element(searchButton).toBeEnabled();
});

const setup = () => {
  window.localStorage.clear();
  const screen = render(Input);
  return {
    keywordTextBox: screen.getByRole('textbox', { name: 'キーワード' }),
    searchButton: screen.getByRole('button', { name: '検索' }),
  } as const;
};
