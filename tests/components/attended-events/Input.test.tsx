import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { Input } from '../../../src/components/attended-events/Input';

test('参加イベント検索_入力検証', async () => {
  const { userIdTextBox, actorNameTextBox, placeNameTextBox, searchButton } =
    setup();

  // 初期状態
  await expect.element(searchButton).toBeDisabled();

  // ユーザーID
  await userIdTextBox.fill('ユーザーID');
  await expect.element(searchButton).toBeEnabled();

  // ユーザーID + 出演者名
  await actorNameTextBox.fill('出演者名');
  await expect.element(searchButton).toBeEnabled();

  // 出演者名
  await userIdTextBox.clear();
  await expect.element(searchButton).toBeDisabled();

  // 出演者名 + 場所名
  await placeNameTextBox.fill('場所名');
  await expect.element(searchButton).toBeDisabled();

  // 場所名
  await actorNameTextBox.clear();
  await expect.element(searchButton).toBeDisabled();

  // ユーザーID + 場所名
  await userIdTextBox.fill('ユーザーID');
  await expect.element(searchButton).toBeEnabled();

  // ユーザーID + 出演者名 + 場所名
  await actorNameTextBox.fill('出演者名');
  await expect.element(searchButton).toBeEnabled();
});

const setup = () => {
  window.localStorage.clear();
  const { baseElement } = render(() => <Input />);
  const screen = page.elementLocator(baseElement);
  return {
    userIdTextBox: screen.getByRole('textbox', { name: 'ユーザーID' }),
    actorNameTextBox: screen.getByRole('textbox', { name: '出演者名' }),
    placeNameTextBox: screen.getByRole('textbox', { name: '会場名' }),
    searchButton: screen.getByRole('button', { name: '検索' }),
  } as const;
};
