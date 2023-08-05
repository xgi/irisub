import { useRecoilValue } from 'recoil';
import styles from '../../styles/components/ExportMenu.module.scss';
import { IconCheck } from '../Icons';
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
    <div className={styles.container}>
      <div className={styles.format}>
        <label>Output details</label>
        <div>
          <input
            placeholder="Filename..."
            value={outputFilename}
            onChange={(e) => setOutputFilename(e.target.value)}
          ></input>
          <Select.Root
            value={selectedOutputFormat}
            onValueChange={(value) => setSelectedOutputFormat(value)}
          >
            <Select.Trigger className={styles.selectTrigger}>
              <Select.Value>{OUTPUT_FORMATS[selectedOutputFormat]}</Select.Value>
            </Select.Trigger>

            <Select.Portal className={styles.selectPortal}>
              <Select.Content className={styles.selectContent} position="popper">
                <Select.Viewport className={styles.selectViewport}>
                  <Select.Group>
                    {Object.entries(OUTPUT_FORMATS).map((outputFormat) => (
                      <Select.Item
                        key={outputFormat[0]}
                        value={outputFormat[0]}
                        className={styles.selectItem}
                      >
                        <Select.ItemText>{outputFormat[1]}</Select.ItemText>
                        <Select.ItemIndicator className={styles.selectItemIndicator}>
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

      <div className={styles.controls}>
        <Button accent onClick={handleExport}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default ExportMenu;
