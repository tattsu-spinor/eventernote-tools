import { type ActionError, actions } from 'astro:actions';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { actionManager } from '../../../src/components/coacting-events/actionManager.svelte.js';
import Output from '../../../src/components/coacting-events/Output.svelte';

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
  await actionManager.search(new FormData());
  expect(getListItems().length).toBe(2);

  // 検索再実行
  coactingEventsMock.mockResolvedValueOnce({
    data: {
      events: createEvents(1),
    },
  });
  await actionManager.search(new FormData());
  expect(getListItems().length).toBe(1);

  // 検索失敗
  coactingEventsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await actionManager.search(new FormData());
  expect(getListItems().length).toBe(1);
});

const setup = () => {
  const screen = render(Output);
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
