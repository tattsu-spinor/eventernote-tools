import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { Input } from '../../../src/components/coacting-events/Input';

test('共演イベント検索_入力検証', async () => {
  const { getTextBoxes, searchButton, addButton, removeButton } = setup();

  // 初期状態
  expect(getTextBoxes().length).toBe(2);
  await expect.element(searchButton).toBeDisabled();
  await expect.element(addButton).toBeEnabled();
  await expect.element(removeButton).toBeEnabled();

  // 出演者名入力
  for (const [index, textBox] of getTextBoxes().entries()) {
    await textBox.fill(`出演者名${index + 1}`);
  }
  expect(getTextBoxes().length).toBe(2);
  await expect.element(searchButton).toBeEnabled();
  await expect.element(addButton).toBeEnabled();
  await expect.element(removeButton).toBeEnabled();

  // 削除ボタン押下
  await removeButton.click();
  expect(getTextBoxes().length).toBe(1);
  await expect.element(searchButton).toBeEnabled();
  await expect.element(addButton).toBeEnabled();
  await expect.element(removeButton).toBeDisabled();

  // 追加ボタン押下
  await addButton.click();
  expect(getTextBoxes().length).toBe(2);
  await expect.element(searchButton).toBeDisabled();
  await expect.element(addButton).toBeEnabled();
  await expect.element(removeButton).toBeEnabled();
});

const setup = () => {
  const { baseElement } = render(() => <Input />);
  const screen = page.elementLocator(baseElement);
  return {
    getTextBoxes: () => screen.getByRole('textbox').all(),
    searchButton: screen.getByRole('button', { name: '検索' }),
    addButton: screen.getByRole('button', { name: '追加' }),
    removeButton: screen.getByRole('button', { name: '削除' }),
  } as const;
};
