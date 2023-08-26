import { useRecoilValue } from 'recoil';
import { IconCheck, IconChevronDown } from '../Icons';
import { useEffect, useState } from 'react';
import { toSrt } from '../../util/convert';
import { currentCueListState, currentProjectState } from '../../store/states';
import { download } from '../../util/actions';
import * as Select from '@radix-ui/react-select';
import { currentTrackSelector } from '../../store/selectors';
import Button from '../Button';

const OUTPUT_FORMATS: { [key: string]: string } = {
  srt: '.srt (SubRip Text)',
  vtt: '.vtt (WebVTT)',
};

type Props = {
  onClose?: () => void;
};

const ExportMenu: React.FC<Props> = (props: Props) => {
  const currentProject = useRecoilValue(currentProjectState);
  const currentTrack = useRecoilValue(currentTrackSelector);

  const currentCueList = useRecoilValue(currentCueListState);
  const [selectedOutputFormat, setSelectedOutputFormat] = useState('srt');
  const [outputFilename, setOutputFilename] = useState('');

  useEffect(() => {
    if (currentProject && currentTrack) {
      setOutputFilename(
        `${currentProject.title.replace(/ /g, '_')}-${currentTrack.name.replace(/ /g, '_')}-${
          currentTrack.languageCode
        }`
      );
    }
  }, [currentProject, currentTrack]);

  const handleExport = () => {
    // TODO generate output according to format
    const output = toSrt(currentCueList || []);
    download(`${outputFilename}.${selectedOutputFormat}`, output);
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col items-start">
        {/* <label>Output details</label> */}
        <div className="w-full flex items-center gap-2 text-sm">
          <input
            className="flex-1 px-2 h-8 outline-none bg-slate-3 hover:bg-slate-4 text-slate-12 border border-slate-7 focus:border-slate-8"
            placeholder="Filename..."
            value={outputFilename}
            onChange={(e) => setOutputFilename(e.target.value)}
          ></input>
          <Select.Root
            value={selectedOutputFormat}
            onValueChange={(value) => setSelectedOutputFormat(value)}
          >
            <Select.Trigger className="inline-flex items-center justify-center gap-1 w-40 h-8 cursor-pointer outline-none border border-slate-6 text-slate-12 bg-slate-3 p-2 hover:bg-slate-4 hover:border-slate-8 focus:bg-slate-4 focus:border-slate-8">
              <Select.Value>{OUTPUT_FORMATS[selectedOutputFormat]}</Select.Value>
              <Select.Icon className="text-slate-12">
                <IconChevronDown />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal className="z-50">
              <Select.Content className="overflow-hidden bg-slate-6" position="popper">
                <Select.Viewport className="p-px w-44">
                  <Select.Group>
                    {Object.entries(OUTPUT_FORMATS).map((outputFormat) => (
                      <Select.Item
                        className="cursor-pointer select-none flex items-center text-sm h-7 pl-6 pt-2 pb-2 relative text-slate-11 bg-slate-1 data-[highlighted]:outline-none data-[highlighted]:text-slate-12 data-[highlighted]:bg-slate-4"
                        key={outputFormat[0]}
                        value={outputFormat[0]}
                      >
                        <Select.ItemText>{outputFormat[1]}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                          <IconCheck />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="w-full flex items-center justify-end pt-4 gap-2 text-sm">
        <Button className="h-8" accent onClick={handleExport}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default ExportMenu;
