import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchUserEventList } from './utils/searchUtil';

export type InputData = {
  userId: string;
  actorName: string;
  placeName: string;
  noCache?: boolean;
};

export type OutputData = {
  readonly events: ReadonlyArray<Event>;
};

export const attendedEvents = defineAction({
  input: z.object({
    userId: z.string().trim(),
    actorName: z.string().trim(),
    placeName: z.string().trim(),
    noCache: z.boolean().default(false),
  }),
  handler: async (
    { userId, actorName, placeName, noCache }: InputData,
    context,
  ) => {
    const eventList = await searchUserEventList(
      userId,
      context.session,
      noCache,
    );
    return {
      events: eventList
        .values()
        .filter((event) => !actorName || event.actors.includes(actorName))
        .filter((event) => !placeName || event.place === placeName)
        .map((event) => omit(event, ['actors']) as Event)
        .toArray(),
    } as OutputData;
  },
});
