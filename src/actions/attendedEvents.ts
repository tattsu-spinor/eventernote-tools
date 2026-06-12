import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchUserEventList } from './utils/searchUtil';

export type InputData = {
  userId: string;
  actorName: string | null;
  placeName: string | null;
};

export type OutputData = {
  readonly events: ReadonlyArray<Event>;
};

export const attendedEvents = defineAction({
  accept: 'form',
  input: z.object({
    userId: z.string().trim(),
    actorName: z.string().trim().nullable(),
    placeName: z.string().trim().nullable(),
    useCache: z.boolean(),
  }),
  handler: async ({ userId, actorName, placeName, useCache }, context) => {
    const eventList = await searchUserEventList(
      userId,
      useCache,
      context.session,
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
