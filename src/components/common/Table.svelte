<script lang="ts" generics="Item">
import type { Snippet } from 'svelte';
import ClipboardCopy from './ClipboardCopy.svelte';
import { PageManager } from './PageManager.svelte.js';
import Pagination from './Pagination.svelte';

type Props = {
  items: ReadonlyArray<Item>;
  header: Snippet;
  row: Snippet<[Item, number]>;
  copyText: () => string;
};
const { items, header, row, copyText }: Props = $props();
const pageManager = new PageManager(() => items);
</script>

<div class="d-card p-2 gap-4">
  <ClipboardCopy
    text={copyText}
  />
  <Pagination
    totalPages={pageManager.totalPages}
    bind:currentPage={pageManager.currentPage}
  />
  <div class="overflow-x-auto">
    <table class="d-table">
      <thead>
        <tr>
          {@render header()}
        </tr>
      </thead>
      <tbody>
        {#each pageManager.pagedItems as { item, index }}
          <tr>
            {@render row(item, index)}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <Pagination
    totalPages={pageManager.totalPages}
    bind:currentPage={pageManager.currentPage}
  />
</div>
