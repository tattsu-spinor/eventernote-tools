import { ClipboardCheckIcon, ClipboardCopyIcon } from 'lucide-solid';
import { type Component, createSignal, Match, Switch } from 'solid-js';

export type ClipboardCopyProps = {
  getText: () => string;
};

export const ClipboardCopy: Component<ClipboardCopyProps> = (props) => {
  const [copied, setCopied] = createSignal(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.getText());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div class="d-card-actions justify-end">
      <button
        type="button"
        onClick={handleCopy}
        class="d-btn d-btn-soft d-btn-sm d-tooltip d-tooltip-accent d-tooltip-left text-sm"
        data-tip="データをCSVとしてコピーする"
      >
        <Switch>
          <Match when={copied()}>
            <ClipboardCheckIcon size={16} />
            <span>Copied!</span>
          </Match>
          <Match when={true}>
            <ClipboardCopyIcon size={16} />
            <span>Copy</span>
          </Match>
        </Switch>
      </button>
    </div>
  );
};
