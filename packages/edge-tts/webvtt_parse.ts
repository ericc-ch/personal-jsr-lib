const NEWLINE = "\n";
const SEPARATOR = "-->";

export function parseTimestamp(timestamp: string): number {
  const [hours, minutes, seconds] = timestamp.trim().split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export interface Cue {
  startTime: number;
  endTime: number;
  text: string;
}

/**
 *
 * This is written with edge tts in mind
 * The function assumes that:
 * 
 *
 * 1. There is no note/comment block
 * 
 * 
 * 2. Text are in a single line
 *
 * @param input WebVTT string
 * @returns
 */
export function parseWebVTT(input: string): Array<Cue> {
  const filtered = input.split(NEWLINE).filter(Boolean).slice(1);

  const [timestamps, texts]: [Array<string>, Array<string>] = filtered.reduce(
    (prev, curr) => {
      if (curr.includes(SEPARATOR)) prev[0].push(curr);
      else prev[1].push(curr);

      return prev;
    },
    [[] as Array<string>, [] as Array<string>]
  );

  const cues: Array<Cue> = timestamps.map((timestamp, index) => {
    const [startTime, endTime] = timestamp.split(SEPARATOR).map(parseTimestamp);

    return {
      startTime,
      endTime,
      text: texts[index],
    };
  });

  return cues;
}
