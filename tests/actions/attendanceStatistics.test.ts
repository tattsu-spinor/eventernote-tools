import { expect, test } from '@playwright/test';

test('参加イベント統計アクション_正常系', async ({ request }) => {
  const response = await request.post('/_actions/attendanceStatistics', {
    data: {
      userId: 'Tattsu_dagaya_',
    },
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]).toBeTruthy();
  expect(data[2]).toBeTruthy();
});

test('参加イベント統計アクション_異常系', async ({ request }) => {
  const response = await request.post('/_actions/attendanceStatistics', {
    data: {
      userId: 'test_user',
    },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('ユーザーが見つかりません: "test_user"');
});
