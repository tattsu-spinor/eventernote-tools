import { actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { Output } from '../../../src/components/attended-events/Output';
import { search } from '../../../src/components/attended-events/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      attendedEvents: vi.fn(),
    },
  };
});
const attendedEventsMock = vi.spyOn(actions, 'attendedEvents');

test('参加イベント検索_出力検証', async () => {
  const { queryListItemElements } = setup();

  // 初期状態
  expect(queryListItemElements().length).toBe(0);

  // 検索実行
  attendedEventsMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        events: createEvents(2),
      },
      error: undefined,
    }),
  );
  await search();
  expect(queryListItemElements().length).toBe(2);

  // 検索再実行
  attendedEventsMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        events: createEvents(1),
      },
      error: undefined,
    }),
  );
  await search();
  expect(queryListItemElements().length).toBe(1);

  // 検索失敗
  attendedEventsMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: undefined,
      error: {
        name: '',
        message: '',
        type: 'AstroActionError',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500,
      },
    }),
  );
  await search();
  expect(queryListItemElements().length).toBe(1);
});

const setup = () => {
  const { queryAllByRole } = render(() => <Output />);
  return {
    queryListItemElements: () => queryAllByRole('listitem'),
  } as const;
};

const createEvents = (count: number) =>
  Array(count).fill({
    name: 'イベント名',
    href: 'https://www.eventernote.com/events/1',
    date: '2025/01/01',
    place: '会場名',
  });
