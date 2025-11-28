import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { intersectionBy, mapAsync, omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchActorEventList } from './utils/searchUtil';

export type InputData = {
  actorNames: ReadonlyArray<string>;
  noCache?: boolean;
};

export type OutputData = {
  readonly events: ReadonlyArray<Event>;
};

export const coactingEvents = defineAction({
  input: z.object({
    actorNames: z.array(z.string().trim()).readonly(),
    noCache: z.boolean().default(false),
  }),
  handler: async ({ actorNames, noCache }: InputData, context) => {
    const eventLists = await mapAsync(actorNames, (actorName) =>
      searchActorEventList(actorName, context.session, noCache),
    );
    return {
      events: eventLists
        .reduce((previous, current) =>
          intersectionBy(previous, current, (event) => event.href),
        )
        .map((event) => omit(event, ['actors']) as Event),
    } as OutputData;
  },
});
