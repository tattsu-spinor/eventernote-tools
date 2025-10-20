import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { parseHTML } from 'linkedom';

export type InputData = {
  userId: string;
};

export type OutputData = {
  readonly actorCounts: ReadonlyArray<readonly [string, number]>;
  readonly placeCounts: ReadonlyArray<readonly [string, number]>;
};

export const attendanceStatistics = defineAction({
  input: z.object({
    userId: z.string().trim(),
  }),
  handler: async ({ userId }: InputData) => {
    const res = await fetch(
      `https://www.eventernote.com/users/${userId}/events?limit=10000`,
    );
    if (!res.ok) {
      throw res.status === 404
        ? new ActionError({
            code: 'BAD_REQUEST',
            message: `ユーザーが見つかりません: "${userId}"`,
          })
        : new ActionError({
            code: 'BAD_GATEWAY',
            message: `{res.status} ${res.statusText}: ${res.url}`,
          });
    }
    const document = parseHTML(await res.text()).document;
    const actorCounts = document
      .querySelectorAll(
        'body > div.container > div.row > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a',
      )
      .values()
      .map((element) => element.textContent ?? '')
      .reduce((counts, actorName) => {
        const count = counts.get(actorName) ?? 0;
        counts.set(actorName, count + 1);
        return counts;
      }, new Map<string, number>());
    const placeCounts = document
      .querySelectorAll(
        'body > div.container > div.row > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div:nth-child(2) > a',
      )
      .values()
      .map((element) => element.textContent ?? '')
      .reduce((counts, placeName) => {
        const count = counts.get(placeName) ?? 0;
        counts.set(placeName, count + 1);
        return counts;
      }, new Map<string, number>());
    return {
      actorCounts: Array.from(actorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
      placeCounts: Array.from(placeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
    } as OutputData;
  },
});
