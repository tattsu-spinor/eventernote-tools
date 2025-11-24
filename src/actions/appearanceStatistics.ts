import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { searchSpecificEventList } from './utils/searchUtil';

export type InputData = {
  keyword: string | null;
  year: string | null;
  month: string | null;
  day: string | null;
  areaId: string | null;
  prefectureId: string | null;
  isPrefectureMode: boolean;
  noCache?: boolean;
};

export type OutputData = {
  readonly searchUrl: string;
  readonly actorCounts: ReadonlyArray<readonly [string, number]>;
};

export const appearanceStatistics = defineAction({
  accept: 'form',
  input: z
    .object({
      keyword: z.string().nullable(),
      year: z.string().nullable(),
      month: z.string().nullable(),
      day: z.string().nullable(),
      areaId: z.string().nullable(),
      prefectureId: z.string().nullable(),
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
  handler: async ({ noCache, ...input }: InputData, context) => {
    const searchUrl = createSearchUrl(input);
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

const createSearchUrl = ({
  keyword,
  year,
  month,
  day,
  areaId,
  prefectureId,
}: InputData) => {
  const url = new URL('https://www.eventernote.com/events/search');
  keyword && url.searchParams.set('keyword', keyword);
  year && url.searchParams.set('year', year);
  month && url.searchParams.set('month', month);
  day && url.searchParams.set('day', day);
  areaId && url.searchParams.set('area_id', areaId);
  prefectureId && url.searchParams.set('prefecture_id', prefectureId);
  return url.toString();
};
