import { actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Output } from '../../../src/components/attendance-statistics/Output';
import { search } from '../../../src/components/attendance-statistics/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      attendanceStatistics: vi.fn(),
    },
  };
});
const attendanceStatisticsMock = vi.spyOn(actions, 'attendanceStatistics');

test('参加イベント統計_出力検証', async () => {
  const { user, queryRowElements, getActorTabElement, getPlaceTabElement } =
    setup();

  // 初期状態
  expect(queryRowElements().length).toBe(0);

  // 検索実行
  attendanceStatisticsMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
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
      error: undefined,
    }),
  );
  await search();
  expect(queryRowElements().length).toBe(3);
  await user.click(getPlaceTabElement());
  expect(queryRowElements().length).toBe(4);

  // 検索再実行
  attendanceStatisticsMock.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        actorCounts: [
          ['出演者名1', 2],
          ['出演者名2', 2],
        ],
        placeCounts: [['会場名1', 2]],
      },
      error: undefined,
    }),
  );
  await search();
  expect(queryRowElements().length).toBe(2);
  await user.click(getActorTabElement());
  expect(queryRowElements().length).toBe(3);

  // 検索失敗
  attendanceStatisticsMock.mockImplementationOnce(() =>
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
  expect(queryRowElements().length).toBe(3);
  await user.click(getPlaceTabElement());
  expect(queryRowElements().length).toBe(2);
});

const setup = () => {
  const { queryAllByRole, getByRole } = render(() => <Output />);
  return {
    user: userEvent.setup(),
    queryRowElements: () => queryAllByRole('row'),
    getActorTabElement: () => getByRole('tab', { name: '出演者' }),
    getPlaceTabElement: () => getByRole('tab', { name: '会場' }),
  } as const;
};
