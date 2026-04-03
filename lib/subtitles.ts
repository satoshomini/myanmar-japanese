export interface SubtitleCue {
  start: number;
  end: number;
  japanese: string;
  romaji: string;
  myanmar: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleMm: string;
  videoId: string;
  level: string;
  subtitles: SubtitleCue[];
}

import lessonsData from '../public/lessons.json';
export const lessons: Lesson[] = lessonsData as Lesson[];
