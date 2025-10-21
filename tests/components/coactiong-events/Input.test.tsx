import { render } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Input } from '../../../src/components/coacting-events/Input';

vi.mock('astro:actions', () => {
  return {};
});

test('共演イベント検索_入力検証', async () => {
  const { user, getInputElements, searchElement, addElement, removeElement } =
    setup();

  // 初期状態
  expect(getInputElements().length).toBe(2);
  expect(searchElement.disabled).toBe(true);
  expect(addElement.disabled).toBe(false);
  expect(removeElement.disabled).toBe(false);

  // 出演者名入力
  for (const [index, element] of getInputElements().entries()) {
    await user.type(element, `出演者名${index + 1}`);
  }
  expect(getInputElements().length).toBe(2);
  expect(searchElement.disabled).toBe(false);
  expect(addElement.disabled).toBe(false);
  expect(removeElement.disabled).toBe(false);

  // 削除ボタン押下
  await user.click(removeElement);
  expect(getInputElements().length).toBe(1);
  expect(searchElement.disabled).toBe(false);
  expect(addElement.disabled).toBe(false);
  expect(removeElement.disabled).toBe(true);

  // 追加ボタン押下
  await user.click(addElement);
  expect(getInputElements().length).toBe(2);
  expect(searchElement.disabled).toBe(true);
  expect(addElement.disabled).toBe(false);
  expect(removeElement.disabled).toBe(false);
});

const setup = () => {
  const { getAllByRole, getByRole } = render(() => <Input />);
  return {
    user: userEvent.setup(),
    getInputElements: () => getAllByRole<HTMLInputElement>('textbox'),
    searchElement: getByRole<HTMLButtonElement>('button', { name: '検索' }),
    addElement: getByRole<HTMLButtonElement>('button', { name: '追加' }),
    removeElement: getByRole<HTMLButtonElement>('button', { name: '削除' }),
  } as const;
};
