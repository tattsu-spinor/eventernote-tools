import { expect, test } from '@playwright/test';

test('共演イベント検索アクション_正常系', async ({ request }) => {
  const response = await request.post('/_actions/coactingEvents', {
    data: {
      actorNames: ['本渡楓', '村上まなつ'],
    },
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]?.length).toBeTruthy(); // events
});

test('共演イベント検索アクション_異常系', async ({ request }) => {
  const response = await request.post('/_actions/coactingEvents', {
    data: {
      actorNames: ['本渡楓', 'ほげ'],
    },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('出演者が見つかりません: "ほげ"');
});
