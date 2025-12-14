import { type ActionReturnType, actions } from 'astro:actions';

const action = actions.appearanceStatistics;
type ActionResult<T extends 'data' | 'error'> = NonNullable<
  ActionReturnType<typeof action>[T]
>;

class ActionManager {
  #data = $state.raw<ReadonlyArray<ActionResult<'data'>>>([]);
  #error = $state.raw<ActionResult<'error'>>();
  #loading = $state.raw<boolean>(false);

  get data() {
    return this.#data;
  }

  get error() {
    return this.#error;
  }

  get loading() {
    return this.#loading;
  }

  async search(form: FormData) {
    this.#loading = true;
    this.#error = undefined;

    const { data, error } = await actions.appearanceStatistics(form);

    this.#loading = false;
    if (error) {
      this.#error = error;
    } else {
      this.#data = this.#data.concat(data);
    }
  }

  remove(index: number) {
    this.#data = this.#data.filter((_, i) => i !== index);
  }
}

export const actionManager = new ActionManager();
