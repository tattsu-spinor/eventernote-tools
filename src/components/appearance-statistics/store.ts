import { createEffect } from 'solid-js';
import { createMutable } from 'solid-js/store';
import type { Result } from '../../../convex/appearanceStatics';

interface Store {
  searchCondition: {
    keyword: string;
    year: string;
    month: string;
    day: string;
    areaId: string;
    prefectureId: string;
    isPrefectureMode: boolean;
  };
  searchUrl: string;
  canNotSearch: boolean;
  loading: boolean;
  errorMessage: string;
  result?: Result;
}

export const store = createMutable<Store>({
  searchCondition: {
    keyword: '',
    year: '',
    month: '',
    day: '',
    areaId: '',
    prefectureId: '',
    isPrefectureMode: false,
  },
  get searchUrl() {
    const { keyword, year, month, day, areaId, prefectureId } =
      this.searchCondition;
    return `https://www.eventernote.com/events/search?keyword=${keyword}&year=${year}&month=${month}&day=${day}&area_id=${areaId}&prefecture_id=${prefectureId}`;
  },
  get canNotSearch() {
    const { keyword, year, month, day, areaId, prefectureId } =
      this.searchCondition;
    return [keyword, year, month, day, areaId, prefectureId].every((v) => !v);
  },
  loading: false,
  errorMessage: '',
});

createEffect(() => {
  if (store.searchCondition.isPrefectureMode) {
    store.searchCondition.areaId = '';
  } else {
    store.searchCondition.prefectureId = '';
  }
});
