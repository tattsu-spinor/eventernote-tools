<script lang="ts">
import { range } from 'es-toolkit';

type Props = {
  totalPages: number;
  currentPage: number;
};

let { totalPages, currentPage = $bindable() }: Props = $props();
</script>

<div class="d-card-actions justify-center">
  {#if totalPages >= 2}
    <div class="d-join">
      <button
        class="d-join-item d-btn d-btn-square d-btn-ghost"
        type="button"
        disabled={currentPage === 1}
        onclick={() => {
          currentPage -= 1;
        }}
      >
        &lt
      </button>
      <label class="d-join-item d-select w-fit">
        <span class="d-label">Page</span>
        <select bind:value={currentPage}>
          {#each range(1, 1 + totalPages) as n}
            <option value={n}>{n} / {totalPages}</option>
          {/each}
        </select>
      </label>
      <button
        class="d-join-item d-btn d-btn-square d-btn-ghost"
        type="button"
        disabled={currentPage === totalPages}
        onclick={() => {
          currentPage += 1;
        }}
      >
        &gt
      </button>
    </div>
  {/if}
</div>
