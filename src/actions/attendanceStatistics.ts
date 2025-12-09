import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { searchUserEventList } from './utils/searchUtil';

export type InputData = {
  userId: string;
  noCache?: boolean;
};

export type OutputData = {
  readonly userId: string;
  readonly actorCounts: ReadonlyArray<readonly [string, number]>;
  readonly placeCounts: ReadonlyArray<readonly [string, number]>;
};

export const attendanceStatistics = defineAction({
  input: z.object({
    userId: z.string().trim(),
    noCache: z.boolean().default(false),
  }),
  handler: async ({ userId, noCache }: InputData, context) => {
    const eventList = await searchUserEventList(
      userId,
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
    const placeCounts = eventList
      .values()
      .map((element) => element.place)
      .reduce((counts, placeName) => {
        const count = counts.get(placeName) ?? 0;
        counts.set(placeName, count + 1);
        return counts;
      }, new Map<string, number>());
    return {
      userId,
      actorCounts: Array.from(actorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
      placeCounts: Array.from(placeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
    } as OutputData;
  },
});
