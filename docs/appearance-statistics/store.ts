import * as Vue from 'vue';

export interface SearchCondition {
  keyword: string;
  year?: number;
  month?: number;
  day?: number;
  areaId?: number;
  prefectureId?: number;
  isPrefectureMode: boolean;
}

export const searchCondition = Vue.ref<SearchCondition>({
  keyword: '',
  isPrefectureMode: false,
});

Vue.watchEffect(() => {
  if (searchCondition.value.isPrefectureMode) {
    searchCondition.value.areaId = undefined;
  } else {
    searchCondition.value.prefectureId = undefined;
  }
});

export const resultUrl = Vue.ref<string>();

export const eventCount = Vue.ref<number>();

export const statistics = Vue.ref<[string, number][]>();

export const loading = Vue.ref(false);

export const errorMessage = Vue.ref<string>();
