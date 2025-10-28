import { type ActionError, actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Output } from '../../../src/components/appearance-statistics/Output';
import { search } from '../../../src/components/appearance-statistics/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      appearanceStatistics: vi.fn(),
    },
  };
});
const appearanceStatisticsMock = vi.mocked(actions.appearanceStatistics, {
  partial: true,
});

test('出演数統計_出力検証', async () => {
  const { getRows, getColumnHeaders } = setup();

  // 初期状態
  expect(getRows().length).toBe(0);
  expect(getColumnHeaders().length).toBe(0);

  // 検索実行
  appearanceStatisticsMock.mockResolvedValueOnce({
    data: {
      searchUrl: 'https://www.eventernote.com/events/search',
      eventCount: 10,
      statistics: [
        ['出演者名1', 3],
        ['出演者名2', 2],
      ],
    },
  });
  await search();
  expect(getRows().length).toBe(3);
  expect(getColumnHeaders().length).toBe(4);

  // 検索再実行
  appearanceStatisticsMock.mockResolvedValueOnce({
    data: {
      searchUrl: 'https://www.eventernote.com/events/search',
      eventCount: 10,
      statistics: [
        ['出演者名1', 2],
        ['出演者名3', 2],
      ],
    },
  });
  await search();
  expect(getRows().length).toBe(4);
  expect(getColumnHeaders().length).toBe(5);

  // 検索失敗
  appearanceStatisticsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await search();
  expect(getRows().length).toBe(4);
  expect(getColumnHeaders().length).toBe(5);
});

const setup = () => {
  const { baseElement } = render(() => <Output />);
  const screen = page.elementLocator(baseElement);
  return {
    getRows: () => screen.getByRole('row').all(),
    getColumnHeaders: () => screen.getByRole('columnheader').all(),
  } as const;
};
