import { useRecoilValue } from 'recoil';
import { visibleCuesSelector } from '../../store/selectors';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const SubtitleOverlay: React.FC<Props> = (props: Props) => {
  const visibleCues = useRecoilValue(visibleCuesSelector);

  const renderLines = () => {
    if (visibleCues.length === 0) return '';

    const lines = visibleCues[0].text.replace(/␤/g, '\n').split('\n');
    return (
      <div className="break-normal mb-4 flex flex-col items-center">
        {lines.map((line, index) => (
          <span key={index} className="bg-black bg-opacity-75 text-white fill-white py-0.5 px-1">
            {line}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full z-30 absolute flex items-end justify-center">{renderLines()}</div>
  );
};

export default SubtitleOverlay;
