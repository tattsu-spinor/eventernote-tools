import { type ActionError, actions } from 'astro:actions';
import type { OutputData } from '../../actions/appearanceStatistics';

class Store {
  #data = $state<OutputData[]>([]);
  #loading = $state.raw<boolean>(false);
  #error = $state.raw<ActionError>();

  get data(): ReadonlyArray<OutputData> {
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

    const { data, error } = await actions.appearanceStatistics(form);

    this.#loading = false;
    if (error) {
      this.#error = error;
    } else {
      this.#data.push(data);
    }
  }

  remove(index: number) {
    this.#data.splice(index, 1);
  }
}

export const store = new Store();
