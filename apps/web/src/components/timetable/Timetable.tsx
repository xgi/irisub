import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCueListState, currentTrackIdState } from '../../store/states';
import styles from '../../styles/components/Timetable.module.scss';
import { nanoid } from 'nanoid';
import { Irisub } from '@irisub/shared';
import CueRow from './CueRow';
import LoadingContainer from '../LoadingContainer';
import { sortedCurrentCueListSelector } from '../../store/selectors';

type Props = {
  handleSeek: (value: number) => void;
};

const Timetable: React.FC<Props> = (props: Props) => {
  const currentTrackId = useRecoilValue(currentTrackIdState);
  const setCurrentCueList = useSetRecoilState(currentCueListState);
  const sortedCurrentCueList = useRecoilValue(sortedCurrentCueListSelector);

  const createNewCue = (text = '') => {
    if (sortedCurrentCueList === null) return;

    let startMs = 0;
    let endMs = 3000;

    if (sortedCurrentCueList.length > 0) {
      const lastCue = sortedCurrentCueList[sortedCurrentCueList.length - 1];
      startMs = lastCue.end_ms;
      endMs = startMs + 3000;
    }

    setCurrentCueList([
      ...sortedCurrentCueList,
      {
        id: nanoid(),
        text: text,
        start_ms: startMs,
        end_ms: endMs,
      },
    ]);
  };

  const handleInputMoveFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (sortedCurrentCueList === null) return;

    let delta = 0;

    if (e.key === 'ArrowUp') delta = -1;
    if (e.key === 'ArrowDown' || e.key === 'Enter') delta = 1;

    if (delta !== 0) {
      const inputId = e.currentTarget.id;
      const splitIdx = inputId.lastIndexOf('-');
      const cueIdx = parseInt(inputId.substring(splitIdx + 1, inputId.length));

      const newCueIdx = cueIdx + delta;
      const _move = () => {
        const newInputId = inputId.substring(0, splitIdx + 1) + newCueIdx;
        const newInput = document.getElementById(newInputId) as HTMLInputElement | null;
        if (newInput) {
          newInput.focus();
          e.preventDefault();

          const selectionPos = e.currentTarget ? e.currentTarget.selectionStart : 0;
          newInput.setSelectionRange(selectionPos, selectionPos);
        }
      };

      if (newCueIdx >= 0 && newCueIdx < sortedCurrentCueList.length) {
        _move();
      } else if (newCueIdx >= sortedCurrentCueList.length && e.key === 'Enter') {
        createNewCue();
        setTimeout(() => _move(), 0);
      }
    }
  };

  const renderRows = () => {
    if (currentTrackId === null || sortedCurrentCueList === null) return;

    // TODO: do sort as selector
    return sortedCurrentCueList.map((cue: Irisub.Cue, index: number) => {
      // TODO: avoid re-renders
      // https://alexsidorenko.com/blog/react-list-rerender/
      return (
        <CueRow
          key={cue.id}
          index={index}
          cue={cue}
          handleInputMoveFocus={handleInputMoveFocus}
          handleSeek={props.handleSeek}
        />
      );
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {sortedCurrentCueList === null ? (
        <LoadingContainer />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              <th>#</th>
              <th style={{ whiteSpace: 'nowrap' }}>Start</th>
              <th>End</th>
              <th title="Characters Per Second">CPS</th>
              <th>Style</th>
              <th>Actor</th>
              <th style={{ textAlign: 'left', paddingLeft: '6px' }}>Text</th>
            </tr>
          </thead>

          <tbody>
            {renderRows()}
            <tr className={styles.add} onClick={() => createNewCue()}>
              <td colSpan={8}>+++</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Timetable;
