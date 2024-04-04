import { reactive } from "vue";

export const store = reactive({
  searchCondition: {
    keyword: "",
    yaer: "",
    month: "",
    day: "",
    areaId: "",
    prefectureId: "",
  } satisfies SearchCondition,
  searchUrl: "",
  statistics: undefined as [string, number][] | undefined,
  eventCount: undefined as number | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

export interface SearchCondition {
  keyword: string;
  yaer: string;
  month: string;
  day: string;
  areaId: string;
  prefectureId: string;
}
