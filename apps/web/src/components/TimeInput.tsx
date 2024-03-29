import { useRecoilValue } from 'recoil';
import { editorShowMsState } from '../store/states';
import { MAX_TIMESTAMP_MS } from '../util/constants';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.LegacyRef<HTMLInputElement> | undefined;
  hasButtons?: boolean;
  valueMs: number;
  callback: (valueInMs: number) => void;
}

const TimeInput: React.FC<Props> = (props: Props) => {
  const showMs = useRecoilValue(editorShowMsState);

  const handleKeyDown = (keyboardEvent: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onKeyDown) props.onKeyDown(keyboardEvent);

    const target = keyboardEvent.target as HTMLInputElement;
    const pointer = target.selectionStart || 0;

    if (
      keyboardEvent.shiftKey &&
      (keyboardEvent.key === 'ArrowUp' || keyboardEvent.key === 'ArrowDown')
    ) {
      props.callback(props.valueMs + (keyboardEvent.key === 'ArrowUp' ? 1 : -1) * 1000);
      window.requestAnimationFrame(() => {
        target.setSelectionRange(pointer, pointer);
      });
      return;
    }

    if (keyboardEvent.key === 'ArrowLeft' || keyboardEvent.key === 'ArrowRight') {
      const delta = keyboardEvent.key === 'ArrowLeft' ? -1 : 1;
      const newPointer = pointer + delta > 0 ? pointer + delta : 0;
      window.requestAnimationFrame(() => {
        target.setSelectionRange(newPointer, newPointer);
      });
      return;
    }

    if (!/[0-9]/.test(keyboardEvent.key)) {
      return;
    }
    const digit = parseInt(keyboardEvent.key);

    let ms = Math.floor(props.valueMs % 1000);
    let seconds = Math.floor((props.valueMs / 1000) % 60);
    let minutes = Math.floor((props.valueMs / (1000 * 60)) % 60);
    let hours = Math.floor((props.valueMs / (1000 * 60 * 60)) % 60);

    let nextPointer = pointer + 1;
    switch (pointer) {
      case 0:
        nextPointer++;
      // eslint-disable-next-line no-fallthrough
      case 1:
        hours = digit;
        break;
      case 2:
        minutes = Math.floor(minutes % 10) + digit * 10;
        break;
      case 3:
        nextPointer++;
      // eslint-disable-next-line no-fallthrough
      case 4:
        minutes = Math.floor(minutes / 10) * 10 + digit;
        break;
      case 5:
        seconds = Math.floor(seconds % 10) + digit * 10;
        break;
      case 6:
        nextPointer++;
      // eslint-disable-next-line no-fallthrough
      case 7:
        seconds = Math.floor(seconds / 10) * 10 + digit;
        break;
      case 8:
        ms = Math.floor(ms % 100) + digit * 100;
        break;
      case 9:
        ms = Math.floor(ms / 100) * 100 + digit * 10 + Math.floor(ms % 10);
        break;
      case 11:
        nextPointer = pointer;
      // eslint-disable-next-line no-fallthrough
      case 10:
        ms = Math.floor(ms / 10) * 10 + digit;
    }

    let newValue = Math.floor(ms + seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000);
    if (newValue > MAX_TIMESTAMP_MS) {
      newValue = MAX_TIMESTAMP_MS;
    }

    props.callback(newValue);

    window.requestAnimationFrame(() => {
      target.setSelectionRange(nextPointer, nextPointer);
    });
  };

  const handleUnary = (deltaSeconds: number) => {
    const newValue = props.valueMs + deltaSeconds * 1000;
    if (newValue < 0) {
      props.callback(0);
    } else {
      props.callback(newValue);
    }
  };

  const { inputRef, valueMs, callback, ...otherProps } = props;
  // rome-ignore lint/performance/noDelete: <explanation>
  delete otherProps.hasButtons;
  return (
    <div className="flex">
      <input
        {...otherProps}
        ref={props.inputRef}
        value={new Date(props.valueMs).toISOString().substring(12, showMs ? 23 : 19)}
        onKeyDown={handleKeyDown}
        onChange={() => true}
      />
      {props.hasButtons ? (
        <div className="flex flex-col content-between text-slate-11">
          <button
            className="leading-4 cursor-pointer text-xs px-1.5 border-none hover:text-slate-12 hover:bg-slate-4"
            onClick={() => handleUnary(1)}
          >
            ▲
          </button>
          <button
            className="leading-4 cursor-pointer text-xs px-1.5 border-none hover:text-slate-12 hover:bg-slate-4"
            onClick={() => handleUnary(-1)}
          >
            ▼
          </button>
        </div>
      ) : undefined}
    </div>
  );
};

export default TimeInput;
