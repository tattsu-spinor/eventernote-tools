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

export const searchUrl = Vue.computed(() => {
  const { keyword, yaer, month, day, areaId, prefectureId } =
    searchCondition.value;
  return `/events/search?keyword=${keyword}&year=${yaer}&month=${month}&day=${day}&area_id=${areaId}&prefecture_id=${prefectureId}&limit=1000`;
});

export const resultUrl = Vue.ref<string>();

export const eventCount = Vue.ref<number>();

export const statistics = Vue.ref<[string, number][]>();

export const loading = Vue.ref(false);

export const error = Vue.ref<Error>();
