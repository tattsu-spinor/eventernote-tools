import { ConvexError } from 'convex/values';
import { range } from 'es-toolkit';
import { parseHTML } from 'linkedom';
import { action } from './_generated/server';

export type Request = {
  searchUrl: string;
};

export type Response = {
  searchUrl: string;
  eventCount: number;
  statistics: [string, number][];
};

export const search = action(
  async (_, { searchUrl }: Request): Promise<Response> => {
    const res = await fetch(searchUrl);
    if (!res.ok) {
      throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
    }
    const eventCountString =
      parseHTML(await res.text()).document.querySelector(
        'body > div.container > div > div.span8.page > p:nth-child(4)',
      )?.textContent ?? '';
    const eventCount =
      Number.parseInt(
        eventCountString.substring(0, eventCountString.indexOf('件')),
      ) || 0;
    if (eventCount > 10000) {
      throw new ConvexError(`イベント数が1万件を超えています: ${eventCount}件`);
    }

    const actorList = await Promise.all(
      range(eventCount / 100).map(async (page) => {
        const res = await fetch(`${searchUrl}&limit=100&page=${page + 1}`);
        if (!res.ok) {
          throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
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
    const map = new Map<string, number>();
    for (const actorName of actorList.flat()) {
      const count = map.get(actorName) ?? 0;
      map.set(actorName, count + 1);
    }

    return {
      searchUrl,
      eventCount,
      statistics: Array.from(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1000),
    };
  },
);
