import { ActionError, defineAction } from 'astro:actions';
import { intersectionBy } from 'es-toolkit';
import { parseHTML } from 'linkedom';

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
  const href = parseHTML(await res.text())
    .document.querySelectorAll(
      'body > div.container > div > div.span8.page > ul > li > a',
    )
    .values()
    .find((el) => el.textContent === name)
    ?.getAttribute('href');
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
  return parseHTML(await res.text())
    .document.querySelectorAll(
      'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li',
    )
    .values()
    .map((element): Event => {
      const eventElement = element.querySelector('div.event > h4 > a');
      return {
        name: eventElement?.textContent ?? '',
        href: eventElement?.getAttribute('href') ?? '',
        date: element.querySelector('div.date > p')?.textContent ?? '',
        place: element.querySelector('div.place > a')?.textContent ?? '',
      };
    })
    .toArray();
};
