import { createEffect, createMemo, createSignal, on } from 'solid-js';
import type { PaginationProps } from './Pagination';

const PAGE_LIMIT = 20;

export const usePagination = <T>(items: () => ReadonlyArray<T>) => {
  const [currentPage, setCurrentPage] = createSignal(1);

  createEffect(
    on(items, () => {
      setCurrentPage(1);
    }),
  );

  return {
    paginationProps: createMemo<PaginationProps>(() => ({
      totalPages: Math.ceil(items().length / PAGE_LIMIT),
      currentPage: currentPage(),
      updatePage: setCurrentPage,
    })),
    pagedItems: createMemo(() =>
      items()
        .map((item, index) => ({ item, index }))
        .slice(PAGE_LIMIT * (currentPage() - 1), PAGE_LIMIT * currentPage()),
    ),
  };
};
