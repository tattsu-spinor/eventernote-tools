const PAGE_LIMIT = 20;

export const usePagination = <T>(items: () => ReadonlyArray<T>) => {
  let currentPage = $state(1);
  const pagedItems = $derived(
    items()
      .map((item, index) => ({ item, index }))
      .slice(PAGE_LIMIT * (currentPage - 1), PAGE_LIMIT * currentPage),
  );

  return {
    totalPages: Math.ceil(items().length / PAGE_LIMIT),
    get currentPage() {
      return currentPage;
    },
    set currentPage(value: number) {
      currentPage = value;
    },
    get pagedItems() {
      return pagedItems;
    },
  };
};
