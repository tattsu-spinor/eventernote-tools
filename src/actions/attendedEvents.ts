import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchUserEventList } from './utils/searchUtil';

export type InputData = {
  userId: string;
  actorName: string;
  placeName: string;
};

export type OutputData = {
  readonly searchName: string;
  readonly events: ReadonlyArray<Event>;
};

export const attendedEvents = defineAction({
  input: z.object({
    userId: z.string().trim(),
    actorName: z.string().trim(),
    placeName: z.string().trim(),
  }),
  handler: async ({ userId, actorName, placeName }: InputData, context) => {
    const eventList = await searchUserEventList(userId, context.session);
    return {
      searchName: JSON.stringify([userId, actorName, placeName], null, 1),
      events: eventList
        .values()
        .filter((event) => event.actors.includes(actorName))
        .filter((event) => event.place === placeName)
        .map((event) => omit(event, ['actors']) as Event)
        .toArray(),
    } as OutputData;
  },
});
