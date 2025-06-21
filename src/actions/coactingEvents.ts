import { ActionError, defineAction } from 'astro:actions';
import * as cheerio from 'cheerio';
import { intersectionBy } from 'es-toolkit';

export type Request = {
  actorNames: string[];
};

export type Response = {
  events: Event[];
};

type Event = {
  name: string;
  href: string;
  date: string;
  place: string;
};

export const coactingEvents = {
  search: defineAction({
    handler: async ({ actorNames }: Request): Promise<Response> => {
      const eventLists = await Promise.all(
        actorNames.values().map(async (actorName) => {
          const id = await searchActorId(actorName);
          return searchEventList(id);
        }),
      );
      return {
        events: eventLists.reduce((previous, current) =>
          intersectionBy(previous, current, (event) => event.href),
        ),
      };
    },
  }),
};

const searchActorId = async (name: string) => {
  const res = await fetch(
    `https://www.eventernote.com/actors/search?keyword=${name}`,
  );
  if (!res.ok) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `${res.status} ${res.statusText}: ${res.url}`,
    });
  }
  const $ = cheerio.load(await res.text());
  const href = $('body > div.container > div > div.span8.page > ul > li > a')
    .filter((_, el) => $(el).text() === name)
    .first()
    .attr('href');
  if (!href) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `出演者が見つかりません: "${name}"`,
    });
  }
  return Number.parseInt(href.substring(href.lastIndexOf('/') + 1));
};

const searchEventList = async (actorId: number) => {
  const res = await fetch(
    `https://www.eventernote.com/actors/${actorId}/events?limit=10000`,
  );
  if (!res.ok) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `{res.status} ${res.statusText}: ${res.url}`,
    });
  }
  const $ = cheerio.load(await res.text());
  return $(
    'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li',
  )
    .map((_, element): Event => {
      const eventElement = $(element).find('div.event > h4 > a').first();
      return {
        name: eventElement.text(),
        href: eventElement.attr('href') ?? '',
        date: $(element).find('div.date > p').first().text(),
        place: $(element).find('div.place > a').first().text(),
      };
    })
    .toArray();
};
