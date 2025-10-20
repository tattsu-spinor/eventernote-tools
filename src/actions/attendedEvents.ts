import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { parseHTML } from 'linkedom';
import type { Event } from '../types/event';

export type InputData = {
  userId: string;
  actorName: string;
  placeName: string;
};

export type OutputData = {
  readonly events: ReadonlyArray<Event>;
};

export const attendedEvents = defineAction({
  input: z.object({
    userId: z.string().trim(),
    actorName: z.string().trim(),
    placeName: z.string().trim(),
  }),
  handler: async ({ userId, actorName, placeName }: InputData) => {
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
    const events = parseHTML(await res.text())
      .document.querySelectorAll(
        'body > div.container > div.row > div.span8.page > div.gb_event_list.clearfix > ul > li',
      )
      .values()
      .filter(
        (element) =>
          !actorName ||
          element
            .querySelectorAll('div.event > div.actor > ul > li > a')
            .values()
            .some((actorElement) => actorElement.textContent === actorName),
      )
      .filter(
        (element) =>
          !placeName ||
          element.querySelector('div.event > div.place > a')?.textContent ===
            placeName,
      )
      .map((element) => {
        const eventElement = element.querySelector('div.event > h4 > a');
        return {
          name: eventElement?.textContent ?? '',
          href: eventElement?.getAttribute('href') ?? '',
          date: element.querySelector('div.date > p')?.textContent ?? '',
          place: element.querySelector('div.place > a')?.textContent ?? '',
        } as Event;
      })
      .toArray();
    return { events } as OutputData;
  },
});
