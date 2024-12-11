'use node';

import * as cheerio from 'cheerio';
import { ConvexError, v } from 'convex/values';
import { range } from 'remeda';
import { action } from './_generated/server';

export const search = action({
  args: {
    searchUrl: v.string(),
  },
  handler: async (_, { searchUrl }) => {
    const res = await fetch(searchUrl);
    if (!res.ok) {
      throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
    }
    const $ = cheerio.load(await res.text());
    const eventCountString = $(
      'body > div.container > div > div.span8.page > p:nth-child(4)',
    ).text();
    const eventCount = Number.parseInt(
      eventCountString.substring(0, eventCountString.indexOf('件')),
    );
    if (eventCount > 10000) {
      throw new ConvexError(`イベント数が1万件を超えています: ${eventCount}件`);
    }

    const actorList = await Promise.all(
      range(1, 1 + eventCount / 100).map(async (page) => {
        const res = await fetch(`${searchUrl}&limit=100&page=${page}`);
        if (!res.ok) {
          throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
        }
        const $ = cheerio.load(await res.text());
        return $(
          'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a',
        )
          .map((_, el) => $(el).text())
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
});
