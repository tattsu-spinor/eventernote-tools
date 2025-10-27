import { expect, test } from '@playwright/test';

test('参加イベント検索アクション_正常系', async ({ request }) => {
  const response = await request.post('/_actions/attendedEvents', {
    data: {
      userId: 'Tattsu_dagaya_',
      actorName: '本渡楓',
      placeName: '',
    },
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]?.length).toBeTruthy(); // events
});

test('参加イベント検索アクション_異常系', async ({ request }) => {
  const response = await request.post('/_actions/attendedEvents', {
    data: {
      userId: 'test_user',
      actorName: '本渡楓',
      placeName: '',
    },
  });
  expect(response.status()).toBe(400);
  const data = await response.json();
  expect(data.message).toBe('ユーザーが見つかりません: "test_user"');
});
