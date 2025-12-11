<script lang="ts">
import { ClipboardCheckIcon, ClipboardCopyIcon } from 'lucide-svelte';

type Props = {
  text: () => string;
};
const { text }: Props = $props();
let copied = $state(false);
const handleCopy = async () => {
  await navigator.clipboard.writeText(text());
  copied = true;
  setTimeout(() => {
    copied = false;
  }, 2000);
};
</script>

<div class="d-card-actions justify-end">
  <button
    class="d-btn d-btn-soft d-btn-sm d-tooltip d-tooltip-accent d-tooltip-left text-sm"
    type="button"
    onclick={handleCopy}
    data-tip="データをCSVとしてコピーする"
  >
    {#if copied}
      <ClipboardCheckIcon size={16} />
      <span>Copied!</span>
    {:else }
      <ClipboardCopyIcon size={16} />
      <span>Copy</span>
    {/if}
  </button>
</div>
