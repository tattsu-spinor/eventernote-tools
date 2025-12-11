import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from '../../../src/components/attendance-statistics/Input.svelte';

test('参加イベント統計_入力検証', async () => {
  const { userIdTextBox, searchButton } = setup();

  // 初期状態
  await expect.element(searchButton).toBeDisabled();

  // 出演者名入力
  await userIdTextBox.fill('ユーザーID');
  await expect.element(searchButton).toBeEnabled();
});

const setup = () => {
  window.localStorage.clear();
  const screen = render(Input);
  return {
    userIdTextBox: screen.getByRole('textbox', { name: 'ユーザーID' }),
    searchButton: screen.getByRole('button', { name: '検索' }),
  } as const;
};
