import { render } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Input } from '../../../src/components/attendance-statistics/Input';

vi.mock('astro:actions', () => {
  return {};
});

test('参加イベント統計_入力検証', async () => {
  const { user, userIdElement, searchElement } = setup();

  // 初期状態
  expect(searchElement.disabled).toBe(true);

  // 出演者名入力
  await user.type(userIdElement, 'ユーザーID');
  expect(searchElement.disabled).toBe(false);
});

const setup = () => {
  const { getByRole } = render(() => <Input />);
  return {
    user: userEvent.setup(),
    userIdElement: getByRole<HTMLInputElement>('textbox', {
      name: 'ユーザーID',
    }),
    searchElement: getByRole<HTMLButtonElement>('button', { name: '検索' }),
  } as const;
};
