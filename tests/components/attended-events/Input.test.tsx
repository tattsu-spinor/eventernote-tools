import { render } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Input } from '../../../src/components/attended-events/Input';

vi.mock('astro:actions', () => {
  return {};
});

test('参加イベント検索_入力検証', async () => {
  const {
    user,
    userIdElement,
    actorNameElement,
    placeNameElement,
    searchElement,
  } = setup();

  // 初期状態
  expect(searchElement.disabled).toBe(true);

  // ユーザーID
  await user.type(userIdElement, 'ユーザーID');
  expect(searchElement.disabled).toBe(false);

  // ユーザーID + 出演者名
  await user.type(actorNameElement, '出演者名');
  expect(searchElement.disabled).toBe(false);

  // 出演者名
  await user.clear(userIdElement);
  expect(searchElement.disabled).toBe(true);

  // 出演者名 + 場所名
  await user.type(placeNameElement, '場所名');
  expect(searchElement.disabled).toBe(true);

  // 場所名
  await user.clear(actorNameElement);
  expect(searchElement.disabled).toBe(true);

  // ユーザーID + 場所名
  await user.type(userIdElement, 'ユーザーID');
  expect(searchElement.disabled).toBe(false);

  // ユーザーID + 出演者名 + 場所名
  await user.type(actorNameElement, '出演者名');
  expect(searchElement.disabled).toBe(false);
});

const setup = () => {
  const { getByRole } = render(() => <Input />);
  return {
    user: userEvent.setup(),
    userIdElement: getByRole<HTMLInputElement>('textbox', {
      name: 'ユーザーID',
    }),
    actorNameElement: getByRole<HTMLInputElement>('textbox', {
      name: '出演者名',
    }),
    placeNameElement: getByRole<HTMLInputElement>('textbox', {
      name: '会場名',
    }),
    searchElement: getByRole<HTMLButtonElement>('button', { name: '検索' }),
  } as const;
};
