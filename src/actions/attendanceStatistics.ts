import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { searchUserEventList } from './utils/searchUtil';

export const attendanceStatistics = defineAction({
  accept: 'form',
  input: z.object({
    userId: z.string().trim(),
    useCache: z.boolean(),
  }),
  handler: async ({ userId, useCache }, context) => {
    const eventList = await searchUserEventList(
      userId,
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
    } as const;
  },
});
