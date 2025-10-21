import { expect, test } from '@playwright/test';

test('参加イベント統計アクション_正常系', async ({ request }) => {
  const response = await request.post('/_actions/appearanceStatistics', {
    data: {
      keyword: '本渡楓',
      year: '2025',
      month: '',
      day: '',
      areaId: '',
      prefectureId: '',
      isPrefectureMode: false,
    },
  });
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data[1]).toBeTruthy();
  expect(data[2]).toBeTruthy();
  expect(data[3]).toBeTruthy();
});

test('参加イベント統計アクション_異常系_イベント数過多', async ({
  request,
}) => {
  const response = await request.post('/_actions/appearanceStatistics', {
    data: {
      keyword: '',
      year: '2025',
      month: '',
      day: '',
      areaId: '',
      prefectureId: '',
      isPrefectureMode: false,
    },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toContain('イベント数が1万件を超えています:');
});

test('参加イベント統計アクション_異常系_検索結果なし', async ({ request }) => {
  const response = await request.post('/_actions/appearanceStatistics', {
    data: {
      keyword: 'ほげ',
      year: '2025',
      month: '',
      day: '',
      areaId: '',
      prefectureId: '',
      isPrefectureMode: false,
    },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe(
    '指定された条件での検索結果が見つかりませんでした。',
  );
});
