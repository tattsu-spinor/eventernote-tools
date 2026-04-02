import { type ActionReturnType, actions } from 'astro:actions';

const action = actions.attendanceStatistics;
type ActionResult<T extends 'data' | 'error'> = NonNullable<
  ActionReturnType<typeof action>[T]
>;

class ActionManager {
  #data = $state.raw<ActionResult<'data'>>();
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

    const { data, error } = await action(form);

    this.#loading = false;
    if (error) {
      this.#error = error;
    } else {
      this.#data = data;
    }
  }
}

export const actionManager = new ActionManager();
