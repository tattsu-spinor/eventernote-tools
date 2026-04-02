const PAGE_LIMIT = 20;

export class PageManager<T> {
  readonly #totalPages: number;
  #currentPage: number;
  readonly #pagedItems;

  constructor(items: () => ReadonlyArray<T>) {
    this.#totalPages = $derived(Math.ceil(items().length / PAGE_LIMIT));
    this.#currentPage = $derived(items().length > 0 ? 1 : 0);
    this.#pagedItems = $derived(
      items()
        .map((item, index) => ({ item, index }))
        .slice(
          PAGE_LIMIT * (this.#currentPage - 1),
          PAGE_LIMIT * this.#currentPage,
        ),
    );
  }

  get totalPages() {
    return this.#totalPages;
  }

  get currentPage() {
    return this.#currentPage;
  }

  set currentPage(value: number) {
    this.#currentPage = value;
  }

  get pagedItems() {
    return this.#pagedItems;
  }
}
