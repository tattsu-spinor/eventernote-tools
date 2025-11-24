export type Event = {
  readonly name: string;
  readonly href: string;
  readonly date: string;
  readonly place: string;
};

export type EventWithActors = Event & {
  readonly actors: ReadonlyArray<string>;
};
