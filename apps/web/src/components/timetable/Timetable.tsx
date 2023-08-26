import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCueListState, currentTrackIdState, editingCueIdState } from '../../store/states';
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
  const editingCueId = useRecoilValue(editingCueIdState);

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
        <table className="w-full border-collapse">
          <thead className="bg-slate-1 text-slate-12 sticky top-0">
            <tr className="leading-loose flex-1 [&>th]:px-2 [&>th]:border-slate-6 [&>th]:border [&>th]:border-t-0">
              <th />
              <th>#</th>
              <th style={{ whiteSpace: 'nowrap' }}>Start</th>
              <th>End</th>
              <th title="Characters Per Second">CPS</th>
              <th>Style</th>
              <th>Actor</th>
              <th className="text-left">Text</th>
            </tr>
          </thead>

          <tbody className="text-slate-12 [&>tr>td]:border-slate-6 [&>tr>td]:border [&>tr>td]:px-2 text-center">
            {renderRows()}
            <tr
              className="bg-slate-3 hover:bg-slate-4 leading-loose flex-1 text-center cursor-pointer select-none"
              onClick={() => createNewCue()}
            >
              <td className="text-center" colSpan={8}>
                +++
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Timetable;
