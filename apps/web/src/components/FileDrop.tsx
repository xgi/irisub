import { ChangeEvent, DragEventHandler, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { playerPathState } from '../store/player';
import { classNames } from '../util/layout';

type Props = unknown;

const FileDrop: React.FC<Props> = (props: Props) => {
  const [dragover, setDragover] = useState(false);
  const setPlayerPath = useSetRecoilState(playerPathState);
  const pickerRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (pickerRef.current) {
      pickerRef.current.click();
    }
  };

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) setPlayerPath(URL.createObjectURL(e.target.files[0]));
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setPlayerPath(URL.createObjectURL(e.dataTransfer.files[0]));
    setDragover(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-[95%] max-h-[95%] w-96 h-48">
        <div
          onClick={handleClick}
          className={classNames(
            'w-full h-full text-slate-11 border-4 border-dashed border-slate-11 rounded-2xl flex flex-col items-center justify-center gap-1 hover:text-slate-12 hover:border-slate-12 cursor-pointer',
            dragover ? 'text-slate-12 border-slate-12' : ''
          )}
          onDragOver={(e) => {
            setDragover(true);
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            setDragover(false);
            e.preventDefault();
          }}
          onDropCapture={handleDrop}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 0 24 24"
              width="48px"
              fill="currentColor"
            >
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
          </span>
          <span className="font-semibold tracking-wider uppercase select-none">Select video</span>
        </div>
        <input className="hidden" type="file" ref={pickerRef} onChange={handlePickerChange} />
      </div>
    </div>
  );
};

export default FileDrop;
