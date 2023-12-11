import { DateCountArray, DateCount } from "../types/dateCountArray";
import { VideoBrowsingHistoryItem } from "../types/jsonInterfaces";

type WatchTimeResult = {
  hours: number;
  minutes: number;
};

export const reverseData = (data: DateCountArray): DateCountArray => {
  return data.reverse();
};

export const getMaxViews = (data: DateCountArray): number => {
  return Math.max(...data.map((pair) => pair.count));
};

export const calculateTotalCount = (data: DateCountArray): number => {
  return data.reduce((total, pair) => total + pair.count, 0);
};

export const calculateWatchTime = (
  videoHistory: VideoBrowsingHistoryItem[]
): WatchTimeResult => {
  const videos = videoHistory.reverse().sort((a, b) => {
    return a.Date.getTime() - b.Date.getTime();
  });

  let watchSeconds = 0;
  for (let i = 1; i < videos.length; i++) {
    const currentVideo = videos[i];
    const previousVideo = videos[i - 1];
    const subtstracted =
      (currentVideo.Date.getTime() - previousVideo.Date.getTime()) / 1000;
    if (subtstracted < 600) {
      watchSeconds += subtstracted;
    }
  }
  const hours = Math.floor(watchSeconds / 3600);
  const minutes = Math.floor((watchSeconds % 3600) / 60);
  const result: WatchTimeResult = {
    hours: hours,
    minutes: minutes,
  };
  return result;
};
