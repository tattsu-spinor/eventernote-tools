import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { range } from 'es-toolkit';
import { parseHTML } from 'linkedom';

export type InputData = {
  readonly searchUrl: string;
};

export type OutputData = {
  readonly searchUrl: string;
  readonly eventCount: number;
  readonly statistics: ReadonlyArray<readonly [string, number]>;
};

export const appearanceStatistics = defineAction({
  input: z.object({ searchUrl: z.string().url() }),
  handler: async ({ searchUrl }: InputData) => {
    const eventCount = await searchEventCount(searchUrl);
    if (eventCount > 10000) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `イベント数が1万件を超えています: ${eventCount}件`,
      });
    }
    const map = new Map<string, number>();
    for (const actorName of await searchActorList(searchUrl, eventCount)) {
      const count = map.get(actorName) ?? 0;
      map.set(actorName, count + 1);
    }
    return {
      searchUrl,
      eventCount,
      statistics: Array.from(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
    } as OutputData;
  },
});

const searchEventCount = async (searchUrl: string) => {
  const res = await fetch(searchUrl);
  if (!res.ok) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `${res.status} ${res.statusText}: ${res.url}`,
    });
  }
  const eventCountText =
    parseHTML(await res.text()).document.querySelector(
      'body > div.container > div > div.span8.page > p:nth-child(4)',
    )?.textContent ?? '';
  return parseInt(eventCountText, 10) || 0;
};

const searchActorList = async (searchUrl: string, eventCount: number) => {
  const actorList = await Promise.all(
    range(eventCount / 100).map(async (page) => {
      const res = await fetch(`${searchUrl}&limit=100&page=${page + 1}`);
      if (!res.ok) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `${res.status} ${res.statusText}: ${res.url}`,
        });
      }
      return parseHTML(await res.text())
        .document.querySelectorAll(
          'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a',
        )
        .values()
        .map((element) => element.textContent ?? '')
        .toArray();
    }),
  );
  return actorList.flat();
};
