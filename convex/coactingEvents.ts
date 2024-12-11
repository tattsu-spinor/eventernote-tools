'use node';

import * as cheerio from 'cheerio';
import { ConvexError, v } from 'convex/values';
import { action } from './_generated/server';

interface Event {
  name: string;
  href: string;
}

export const search = action({
  args: { actorNames: v.array(v.string()) },
  handler: async (_, { actorNames }) => {
    const eventLists: Event[][] = await Promise.all(
      actorNames.map(async (actorName) => {
        const id = await searchActorId(actorName);
        const res = await fetch(
          `https://www.eventernote.com/actors/${id}/events?limit=10000`,
        );
        if (!res.ok) {
          throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
        }
        const $ = cheerio.load(await res.text());
        return $(
          'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > h4 > a',
        )
          .map((_, el) => ({
            name: $(el).text(),
            href: $(el).attr('href'),
          }))
          .toArray();
      }),
    );
    return eventLists.reduce((previous, current) =>
      intersect(previous, current),
    );
  },
});

const searchActorId = async (name: string) => {
  const res = await fetch(
    `https://www.eventernote.com/actors/search?keyword=${name}`,
  );
  if (!res.ok) {
    throw new ConvexError(`${res.status} ${res.statusText}: ${res.url}`);
  }
  const $ = cheerio.load(await res.text());
  const href = $('body > div.container > div > div.span8.page > ul > li > a')
    .filter((_, el) => $(el).text() === name)
    .first()
    .attr('href');
  if (!href) {
    throw new ConvexError(`出演者が見つかりません: "${name}"`);
  }
  return Number.parseInt(href.substring(href.lastIndexOf('/') + 1));
};

const intersect = (aEvents: Event[], bEvents: Event[]) => {
  const aHrefSet = new Set(aEvents.map((e) => e.href));
  return bEvents.filter((bEvent) => aHrefSet.has(bEvent.href));
};
