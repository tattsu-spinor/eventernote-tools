import { expect, test } from '@playwright/test';

test('参加イベント検索アクション_正常系', async ({ request }) => {
  const form = new FormData();
  form.append('userId', 'Tattsu_dagaya_');
  form.append('actorName', '本渡楓');
  form.append('placeName', '');
  const response = await request.post('/_actions/attendedEvents', { form });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]?.length).toBeTruthy(); // events
});

test('参加イベント検索アクション_異常系', async ({ request }) => {
  const form = new FormData();
  form.append('userId', 'test_user');
  form.append('actorName', '本渡楓');
  form.append('placeName', '');
  const response = await request.post('/_actions/attendedEvents', { form });
  expect(response.status()).toBe(400);
  const data = await response.json();
  expect(data.message).toBe('ユーザーが見つかりません: "test_user"');
});
