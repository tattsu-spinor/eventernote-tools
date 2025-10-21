import { render } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Input } from '../../../src/components/coacting-events/Input';

vi.mock('astro:actions', () => {
  return {};
});

test('出演数統計_入力検証', async () => {
  const { searchElement } = setup();

  // 初期状態
  expect(searchElement.disabled).toBe(true);
});

const setup = () => {
  const { getByRole } = render(() => <Input />);
  return {
    user: userEvent.setup(),
    searchElement: getByRole<HTMLButtonElement>('button', { name: '検索' }),
  } as const;
};
