import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { searchSpecificEventList } from './utils/searchUtil';

export type InputData = {
  keyword: string;
  year: string;
  month: string;
  day: string;
  areaId: string;
  prefectureId: string;
  isPrefectureMode: boolean;
  noCache?: boolean;
};

export type OutputData = {
  readonly searchUrl: string;
  readonly actorCounts: ReadonlyArray<readonly [string, number]>;
};

export const appearanceStatistics = defineAction({
  input: z
    .object({
      keyword: z.string().trim(),
      year: z.string().trim(),
      month: z.string().trim(),
      day: z.string().trim(),
      areaId: z.string().trim(),
      prefectureId: z.string().trim(),
      isPrefectureMode: z.boolean(),
      noCache: z.boolean().default(false),
    })
    .transform((input) => {
      if (input.isPrefectureMode) {
        input.areaId = '';
      } else {
        input.prefectureId = '';
      }
      return input;
    }),
  handler: async (
    { keyword, year, month, day, areaId, prefectureId, noCache }: InputData,
    context,
  ) => {
    const searchUrl = `https://www.eventernote.com/events/search?keyword=${keyword}&year=${year}&month=${month}&day=${day}&area_id=${areaId}&prefecture_id=${prefectureId}`;
    const eventList = await searchSpecificEventList(
      searchUrl,
      context.session,
      noCache,
    );
    const actorCounts = eventList
      .values()
      .flatMap((element) => element.actors)
      .reduce((counts, actorName) => {
        const count = counts.get(actorName) ?? 0;
        counts.set(actorName, count + 1);
        return counts;
      }, new Map<string, number>());
    return {
      searchUrl,
      actorCounts: Array.from(actorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
    } as OutputData;
  },
});
