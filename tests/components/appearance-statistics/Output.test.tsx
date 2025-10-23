import { actions } from 'astro:actions';
import { render } from '@solidjs/testing-library';
import { expect, test, vi } from 'vitest';
import { Output } from '../../../src/components/appearance-statistics/Output';
import { search } from '../../../src/components/appearance-statistics/store';

vi.mock('astro:actions', () => {
  return {
    actions: {
      appearanceStatistics: vi.fn(),
    },
  };
});
const appearanceStatisticsMock = vi.spyOn(actions, 'appearanceStatistics');

test('出演数統計_出力検証', async () => {
  const { queryRowElements } = setup();

  // 初期状態
  expect(queryRowElements().length).toBe(0);
});

const setup = () => {
  const { queryAllByRole } = render(() => <Output />);
  return {
    queryRowElements: () => queryAllByRole('row'),
  } as const;
};
