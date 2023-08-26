import { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-dark.min.css'; // TODO: update style
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCueListState, editingCueIdState, editingCueState } from '../store/states';
import { useDebouncedValue } from '../util/hooks';
import { shallowEqual } from '../util/comparison';
import { sortedCurrentCueListSelector } from '../store/selectors';

type Props = unknown;
const TextEditor: React.FC<Props> = (props: Props) => {
  const [editingCue, setEditingCue] = useRecoilState(editingCueState);
  const sortedCurrentCueList = useRecoilValue(sortedCurrentCueListSelector);
  const setEditingCueId = useSetRecoilState(editingCueIdState);
  const setCurrentCueList = useSetRecoilState(currentCueListState);

  const [value, setValue] = useState(editingCue);
  const [debounced] = useDebouncedValue(value, 500);

  useEffect(() => {
    setValue(editingCue);
  }, [editingCue]);

  useEffect(() => {
    if (debounced !== null) {
      const newCueList = sortedCurrentCueList ? [...sortedCurrentCueList] : [];
      const indexToModify = newCueList.findIndex((cue) => cue.id === debounced.id);

      if (indexToModify !== -1) {
        if (!shallowEqual(newCueList[indexToModify], debounced)) {
          newCueList[indexToModify] = { ...debounced };
          setCurrentCueList(newCueList);
        }
      } else {
        console.warn(
          `Attempted to modify cue, but could not find existing with ID: ${debounced.id}`
        );
      }
    }
  }, [debounced]);

  useEffect(() => {
    if (sortedCurrentCueList && sortedCurrentCueList.length > 0) {
      if (value === null) {
        setEditingCue(sortedCurrentCueList[0]);
        setEditingCueId(sortedCurrentCueList[0].id);
      }
    } else {
      setEditingCue(null);
      setEditingCueId(null);
    }
  }, [sortedCurrentCueList]);

  return (
    <Editor
      className="bg-slate-2 h-full border-none leading-6 [&>*]:outline-none"
      placeholder="Edit text..."
      value={value ? value.text : ''}
      onValueChange={(newText: string) => {
        if (value) setValue({ ...value, text: newText });
      }}
      highlight={(value: string) => Prism.highlight(value || '', Prism.languages.html, 'html')}
      padding={10}
    />
  );
};

export default TextEditor;
