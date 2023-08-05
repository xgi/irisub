import { Irisub } from '@irisub/shared';

const msToDateStr = (value: number) => {
  return new Date(value).toISOString().split('T')[1].split('Z')[0].replace('.', ',');
};

export const toSrt = (cueList: Irisub.Cue[]): string => {
  const outputLines: string[] = [];

  cueList.forEach((cue, index) => {
    const text = cue.text.replace(/␤/g, '\n');

    outputLines.push(`${index + 1}`);
    outputLines.push(`${msToDateStr(cue.start_ms)} --> ${msToDateStr(cue.end_ms)}`);
    outputLines.push(text);
    outputLines.push('');
  });

  return outputLines.join('\n');
};
