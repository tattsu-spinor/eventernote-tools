import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { searchSpecificEventList } from './utils/searchUtil';

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
      useCache: z.boolean(),
    })
    .transform((input) => {
      if (input.isPrefectureMode) {
        input.areaId = '';
      } else {
        input.prefectureId = '';
      }
      return input;
    }),
  handler: async ({ useCache, ...input }, context) => {
    const searchUrl = createSearchUrl(input);
    const eventList = await searchSpecificEventList(
      searchUrl,
      useCache,
      context.session,
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
    } as const;
  },
});

type Input = {
  keyword: string | null;
  year: string | null;
  month: string | null;
  day: string | null;
  areaId: string | null;
  prefectureId: string | null;
  isPrefectureMode: boolean;
};

const createSearchUrl = ({
  keyword,
  year,
  month,
  day,
  areaId,
  prefectureId,
}: Input) => {
  const url = new URL('https://www.eventernote.com/events/search');
  keyword && url.searchParams.set('keyword', keyword);
  year && url.searchParams.set('year', year);
  month && url.searchParams.set('month', month);
  day && url.searchParams.set('day', day);
  areaId && url.searchParams.set('area_id', areaId);
  prefectureId && url.searchParams.set('prefecture_id', prefectureId);
  return url.toString();
};
