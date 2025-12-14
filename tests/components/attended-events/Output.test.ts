import { type ActionError, actions } from 'astro:actions';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { actionManager } from '../../../src/components/attended-events/actionManager.svelte.js';
import Output from '../../../src/components/attended-events/Output.svelte';

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
      events: createEvents(2),
    },
  });
  await actionManager.search(new FormData());
  expect(queryListItemElements().length).toBe(2);

  // 検索再実行
  attendedEventsMock.mockResolvedValueOnce({
    data: {
      events: createEvents(1),
    },
  });
  await actionManager.search(new FormData());
  expect(queryListItemElements().length).toBe(1);

  // 検索失敗
  attendedEventsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await actionManager.search(new FormData());
  expect(queryListItemElements().length).toBe(1);
});

const setup = () => {
  const screen = render(Output);
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
