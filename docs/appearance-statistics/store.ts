import * as Vue from "vue";

export interface SearchCondition {
  keyword: string;
  yaer: string;
  month: string;
  day: string;
  areaId: string;
  prefectureId: string;
}

export const searchCondition = Vue.ref<SearchCondition>({
  keyword: "",
  yaer: "",
  month: "",
  day: "",
  areaId: "",
  prefectureId: "",
});

export const resultUrl = Vue.ref<string>();

export const eventCount = Vue.ref<number>();

export const statistics = Vue.ref<[string, number][]>();

export const loading = Vue.ref(false);

export const error = Vue.ref<Error>();
