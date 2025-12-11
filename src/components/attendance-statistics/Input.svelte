<script lang="ts">
import { onMount } from 'svelte';
import { store } from './store.svelte';

const INPUT_DATA_KEY = 'attendanceStatistics.inputData';
let inputData = $state({
  userId: '',
});
const canNotSearch = $derived(!inputData.userId);

const saveInputData = () => {
  localStorage.setItem(INPUT_DATA_KEY, JSON.stringify(inputData));
};

onMount(() => {
  const storedInput = localStorage.getItem(INPUT_DATA_KEY);
  if (storedInput) {
    inputData = JSON.parse(storedInput);
  }
});
</script>

<form
  class="d-card p-2 gap-4"
  onsubmit={async (e) => {
    e.preventDefault();
    await store.search(new FormData(e.currentTarget));
  }}
>
  <input type="hidden" name="useCache" value="true" />

  <label class="d-floating-label">
    <span>ユーザーID</span>
    <input
      class="d-input"
      type="text"
      name="userId"
      placeholder="ユーザーID"
      bind:value={inputData.userId}
      onblur={() => {
        inputData.userId = inputData.userId.trim();
        saveInputData();
      }}
    />
  </label>

  <div class="d-card-actions">
    <button
      class="d-btn d-btn-primary"
      type="submit"
      disabled={store.loading || canNotSearch}
    >
      検索
      {#if store.loading}
        <span class="d-loading d-loading-spinner"></span>
      {/if}
    </button>
  </div>

  {#if store.error}
    {@const error = store.error}
    <div class="d-alert d-alert-error" role="alert">
      <span>
        {error.code !== 'INTERNAL_SERVER_ERROR' && error.message
          ? error.message
          : '予期せぬエラーが発生しました。'}
      </span>
    </div>
  {/if}
</form>
