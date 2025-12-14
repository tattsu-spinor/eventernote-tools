<script module lang="ts">
export const INPUT_DATA_KEY = 'attendedEvents.inputData';
</script>

<script lang="ts">
import { onMount, tick } from "svelte";
import { actionManager } from './actionManager.svelte.js';

let inputData = $state({
  userId: '',
  actorName: '',
  placeName: '',
});
const canNotSearch = $derived(!inputData.userId);
let form: HTMLFormElement;

const saveInputData = () => {
  localStorage.setItem(INPUT_DATA_KEY, JSON.stringify(inputData));
};

onMount(async () => {
  const sessionInput = sessionStorage.getItem(INPUT_DATA_KEY);
  if (sessionInput) {
    inputData = JSON.parse(sessionInput);
    await tick();
    form.dispatchEvent(new Event('submit'));
    sessionStorage.removeItem(INPUT_DATA_KEY);
    return;
  }

  const storedInput = localStorage.getItem(INPUT_DATA_KEY);
  if (storedInput) {
    inputData = JSON.parse(storedInput);
  }
});
</script>

<form
  class="d-card p-2 gap-4"
  bind:this={form}
  onsubmit={async (e) => {
    e.preventDefault();
    await actionManager.search(new FormData(e.currentTarget));
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

  <label class="d-floating-label">
    <span>出演者名</span>
    <input
      class="d-input"
      type="text"
      name="actorName"
      placeholder="出演者名（オプション）"
      bind:value={inputData.actorName}
      onblur={() => {
        inputData.actorName = inputData.actorName.trim();
        saveInputData();
      }}
    />
  </label>

  <label class="d-floating-label">
    <span>会場名</span>
    <input
      class="d-input"
      type="text"
      name="placeName"
      placeholder="会場名（オプション）"
      bind:value={inputData.placeName}
      onblur={() => {
        inputData.placeName = inputData.placeName.trim();
        saveInputData();
      }}
    />
  </label>

  <div class="d-card-actions">
    <button
      class="d-btn d-btn-primary"
      type="submit"
      disabled={actionManager.loading || canNotSearch}
    >
      検索
      {#if actionManager.loading}
        <span class="d-loading d-loading-spinner"></span>
      {/if}
    </button>
  </div>

  {#if actionManager.error}
    {@const error = actionManager.error}
    <div class="d-alert d-alert-error" role="alert">
      <span>
        {error.code !== 'INTERNAL_SERVER_ERROR' && error.message
          ? error.message
          : '予期せぬエラーが発生しました。'}
      </span>
    </div>
  {/if}
</form>
