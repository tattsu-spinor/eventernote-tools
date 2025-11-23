import { type ActionError, actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Output } from '../../../src/components/attended-events/Output';
import { search } from '../../../src/components/attended-events/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      attendedEvents: vi.fn(),
    },
  };
});
const attendedEventsMock = vi.mocked(actions.attendedEvents, {
  partial: true,
});

test('参加イベント検索_出力検証', async () => {
  const { queryListItemElements } = setup();

  // 初期状態
  expect(queryListItemElements().length).toBe(0);

  // 検索実行
  attendedEventsMock.mockResolvedValueOnce({
    data: {
      searchName: 'name1',
      events: createEvents(2),
    },
  });
  await search();
  expect(queryListItemElements().length).toBe(2);

  // 検索再実行
  attendedEventsMock.mockResolvedValueOnce({
    data: {
      searchName: 'name2',
      events: createEvents(1),
    },
  });
  await search();
  expect(queryListItemElements().length).toBe(1);

  // 検索失敗
  attendedEventsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await search();
  expect(queryListItemElements().length).toBe(1);
});

const setup = () => {
  const { baseElement } = render(() => <Output />);
  const screen = page.elementLocator(baseElement);
  return {
    queryListItemElements: () => screen.getByRole('listitem'),
  } as const;
};

const createEvents = (count: number) =>
  Array(count).fill({
    name: 'イベント名',
    href: 'https://www.eventernote.com/events/1',
    date: '2025/01/01',
    place: '会場名',
  });
