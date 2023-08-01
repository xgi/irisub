import { Irisub } from '@irisub/shared';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editingCueIdState, editingCueState } from '../../store/states';
import styles from '../../styles/components/CueTextInput.module.scss';

type Props = {
  index: number;
  cue: Irisub.Cue;
  callback: (text: string) => void;
  handleInputMoveFocus: (e: React.KeyboardEvent<HTMLInputElement>, isKeyUp?: boolean) => void;
};

const CueTextInput: React.FC<Props> = (props: Props) => {
  const [editingCueId, setEditingCueId] = useRecoilState(editingCueIdState);
  const [editingCue, setEditingCue] = useRecoilState(editingCueState);
  const [value, setValue] = useState(props.cue.text);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) setEditingCue({ ...props.cue, text: value });
  }, [editing, value]);

  useEffect(() => {
    props.callback(value);
  }, [value]);

  useEffect(() => {
    setValue(props.cue.text);
  }, [props.cue.text]);

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      setValue(value + '\n');
      return;
    }

    props.handleInputMoveFocus(e);
  };

  return (
    <input
      id={`timetable-input-text-${props.index}`}
      className={styles.input}
      autoComplete="new-password"
      tabIndex={props.index + 1}
      placeholder=""
      value={value.replace(/\n/g, '␤')}
      onChange={(e) => setValue(e.target.value)}
      // onChange={(changeEvent: any) =>
      //   updateEvent(props.index, {
      //     text: changeEvent.target.value.replaceAll("␤", "\n"),
      //   })
      // }
      onKeyDown={(e) => handleTextInputKeyDown(e)}
      onFocus={() => {
        setEditingCueId(props.cue.id);
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
    />
  );
};

export default CueTextInput;
