import { expect, test } from '@playwright/test';

test('参加イベント統計アクション_正常系', async ({ request }) => {
  const form = new FormData();
  form.append('keyword', '本渡楓');
  form.append('year', '2025');
  form.append('month', '');
  form.append('day', '');
  form.append('areaId', '');
  form.append('prefectureId', '');
  form.append('isPrefectureMode', 'false');
  const response = await request.post('/_actions/appearanceStatistics', {
    form,
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]).toBeTruthy(); // searchUrl
  expect(data[2]).toBeTruthy(); // eventCount
  expect(data[3]?.length).toBeTruthy(); // statistics
});

test('参加イベント統計アクション_異常系_イベント数過多', async ({
  request,
}) => {
  const form = new FormData();
  form.append('keyword', '');
  form.append('year', '2025');
  form.append('month', '');
  form.append('day', '');
  form.append('areaId', '');
  form.append('prefectureId', '');
  form.append('isPrefectureMode', 'false');
  const response = await request.post('/_actions/appearanceStatistics', {
    form,
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toContain('イベント数が1万件を超えています:');
});

test('参加イベント統計アクション_異常系_検索結果なし', async ({ request }) => {
  const form = new FormData();
  form.append('keyword', 'ほげ');
  form.append('year', '2025');
  form.append('month', '');
  form.append('day', '');
  form.append('areaId', '');
  form.append('prefectureId', '');
  form.append('isPrefectureMode', 'false');
  const response = await request.post('/_actions/appearanceStatistics', {
    form,
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe(
    '指定された条件での検索結果が見つかりませんでした。',
  );
});
