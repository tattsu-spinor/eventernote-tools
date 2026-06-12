import { expect, test } from '@playwright/test';

test('共演イベント検索アクション_正常系', async ({ request }) => {
  const form = new FormData();
  form.append('actorNames', '本渡楓');
  form.append('actorNames', '村上まなつ');
  const response = await request.post('/_actions/coactingEvents', { form });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]?.length).toBeTruthy(); // events
});

test('共演イベント検索アクション_異常系', async ({ request }) => {
  const form = new FormData();
  form.append('actorNames', '本渡楓');
  form.append('actorNames', 'ほげ');
  const response = await request.post('/_actions/coactingEvents', { form });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('出演者が見つかりません: "ほげ"');
});
