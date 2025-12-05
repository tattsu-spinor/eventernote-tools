import { expect, test } from '@playwright/test';

test('参加イベント統計アクション_正常系', async ({ request }) => {
  const form = new FormData();
  form.append('userId', 'Tattsu_dagaya_');
  const response = await request.post('/_actions/attendanceStatistics', {
    form,
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]?.length).toBeTruthy(); // actorCounts
  expect(data[2]?.length).toBeTruthy(); // placeCounts
});

test('参加イベント統計アクション_異常系', async ({ request }) => {
  const form = new FormData();
  form.append('userId', 'test_user');
  const response = await request.post('/_actions/attendanceStatistics', {
    form,
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('ユーザーが見つかりません: "test_user"');
});
