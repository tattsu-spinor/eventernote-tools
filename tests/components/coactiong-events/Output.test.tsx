import { type ActionError, actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Output } from '../../../src/components/coacting-events/Output';
import { search } from '../../../src/components/coacting-events/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      coactingEvents: vi.fn(),
    },
  };
});
const coactingEventsMock = vi.mocked(actions.coactingEvents, {
  partial: true,
});

test('共演イベント検索_出力検証', async () => {
  const { getListItems } = setup();

  // 初期状態
  expect(getListItems().length).toBe(0);

  // 検索実行
  coactingEventsMock.mockResolvedValueOnce({
    data: {
      events: createEvents(2),
    },
  });
  await search(new FormData());
  expect(getListItems().length).toBe(2);

  // 検索再実行
  coactingEventsMock.mockResolvedValueOnce({
    data: {
      events: createEvents(1),
    },
  });
  await search(new FormData());
  expect(getListItems().length).toBe(1);

  // 検索失敗
  coactingEventsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await search(new FormData());
  expect(getListItems().length).toBe(1);
});

const setup = () => {
  const { baseElement } = render(() => <Output />);
  const screen = page.elementLocator(baseElement);
  return {
    getListItems: () => screen.getByRole('listitem').all(),
  } as const;
};

const createEvents = (count: number) =>
  Array(count).fill({
    name: 'イベント名',
    href: 'https://www.eventernote.com/events/1',
    date: '2025/01/01',
    place: '会場名',
  });
