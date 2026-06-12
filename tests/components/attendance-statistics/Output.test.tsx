import { type ActionError, actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Output } from '../../../src/components/attendance-statistics/Output';
import { search } from '../../../src/components/attendance-statistics/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      attendanceStatistics: vi.fn(),
    },
  };
});
const attendanceStatisticsMock = vi.mocked(actions.attendanceStatistics, {
  partial: true,
});

test('参加イベント統計_出力検証', async () => {
  const { queryRowElements, getActorTabElement, getPlaceTabElement } = setup();

  // 初期状態
  expect(queryRowElements().length).toBe(0);

  // 検索実行
  attendanceStatisticsMock.mockResolvedValueOnce({
    data: {
      userId: 'userId',
      actorCounts: [
        ['出演者名1', 3],
        ['出演者名2', 2],
      ],
      placeCounts: [
        ['会場名1', 2],
        ['会場名2', 1],
        ['会場名3', 1],
      ],
    },
  });
  await search(new FormData());
  expect(queryRowElements().length).toBe(3);
  await getPlaceTabElement().click();
  expect(queryRowElements().length).toBe(4);

  // 検索再実行
  attendanceStatisticsMock.mockResolvedValueOnce({
    data: {
      userId: 'userId',
      actorCounts: [
        ['出演者名1', 2],
        ['出演者名2', 2],
      ],
      placeCounts: [['会場名1', 2]],
    },
  });
  await search(new FormData());
  expect(queryRowElements().length).toBe(2);
  await getActorTabElement().click();
  expect(queryRowElements().length).toBe(3);

  // 検索失敗
  attendanceStatisticsMock.mockResolvedValueOnce({
    error: {} as ActionError,
  });
  await search(new FormData());
  expect(queryRowElements().length).toBe(3);
  await getPlaceTabElement().click();
  expect(queryRowElements().length).toBe(2);
});

const setup = () => {
  const { baseElement } = render(() => <Output />);
  const screen = page.elementLocator(baseElement);
  return {
    queryRowElements: () => screen.getByRole('row'),
    getActorTabElement: () => screen.getByRole('tab', { name: '出演者' }),
    getPlaceTabElement: () => screen.getByRole('tab', { name: '会場' }),
  } as const;
};
