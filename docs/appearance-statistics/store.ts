import * as Vue from "vue";

export interface SearchCondition {
  keyword: string;
  yaer?: number;
  month?: number;
  day?: number;
  areaId?: number;
  prefectureId?: number;
}

export const searchCondition = Vue.ref<SearchCondition>({
  keyword: "",
});

export const resultUrl = Vue.ref<string>();

export const eventCount = Vue.ref<number>();

export const statistics = Vue.ref<[string, number][]>();

export const loading = Vue.ref(false);

export const error = Vue.ref<Error>();
