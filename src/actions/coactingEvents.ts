import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { intersectionBy, mapAsync, omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchActorEventList } from './utils/searchUtil';

export const coactingEvents = defineAction({
  accept: 'form',
  input: z.object({
    actorNames: z.array(z.string().trim()),
    useCache: z.boolean(),
  }),
  handler: async ({ actorNames, useCache }, context) => {
    const eventLists = await mapAsync(actorNames, (actorName) =>
      searchActorEventList(actorName, useCache, context.session),
    );
    return {
      events: eventLists
        .reduce((previous, current) =>
          intersectionBy(previous, current, (event) => event.href),
        )
        .map((event) => omit(event, ['actors']) as Event),
    } as const;
  },
});
