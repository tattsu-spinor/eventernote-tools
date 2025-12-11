import { type ActionError, actions } from 'astro:actions';
import type { OutputData } from '../../actions/attendanceStatistics';

class Store {
  #data = $state.raw<OutputData>();
  #loading = $state.raw<boolean>(false);
  #error = $state.raw<ActionError>();

  get data(): OutputData | undefined {
    return this.#data;
  }

  get loading(): boolean {
    return this.#loading;
  }

  get error(): ActionError | undefined {
    return this.#error;
  }

  async search(form: FormData) {
    this.#loading = true;
    this.#error = undefined;

    const { data, error } = await actions.attendanceStatistics(form);

    this.#loading = false;
    if (error) {
      this.#error = error;
    } else {
      this.#data = data;
    }
  }
}

export const store = new Store();
