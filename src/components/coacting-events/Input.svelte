<script lang="ts">
import { onMount } from 'svelte';
import { store } from './store.svelte';

const ACTOR_NAMES_KEY = 'coactingEvents.actorNames';
let actorNames = $state(['', '']);
const canNotSearch = $derived(actorNames.some((v) => !v));

const saveActorNames = () => {
  localStorage.setItem(ACTOR_NAMES_KEY, JSON.stringify(actorNames));
};

onMount(() => {
  const storedActorNames = localStorage.getItem(ACTOR_NAMES_KEY);
  if (storedActorNames) {
    actorNames = JSON.parse(storedActorNames);
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

  {#each actorNames as actorName, index}
    <label class="d-floating-label">
      <span>{`出演者名${index + 1}`}</span>
      <input
        class="d-input"
        type="text"
        name="actorNames"
        placeholder={`出演者名${index + 1}`}
        bind:value={actorNames[index]}
        onblur={() => {
          actorNames[index] = actorName.trim();
          saveActorNames();
        }}
      />
    </label>
  {/each}

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
    <button
      class="d-btn d-btn-secondary"
      type="button"
      disabled={store.loading}
      onclick={() => {
        actorNames.push('');
        saveActorNames();
      }}
    >
      追加
    </button>
    <button
      class="d-btn d-btn-warning"
      type="button"
      disabled={store.loading || actorNames.length <= 1}
      onclick={() => {
        actorNames.pop();
        saveActorNames();
      }}
    >
      削除
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
