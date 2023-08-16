import { DateCount, DateCountArray } from "../types/dateCountArray";
import { VideoBrowsingHistoryItem } from "../types/jsonInterfaces";

export const computeDailyCounts = (videoHistory: VideoBrowsingHistoryItem[]): DateCountArray | null => {
  if (videoHistory) {
    const dateCountMap: Map<string, DateCount> = new Map();

  videoHistory.forEach(video => {
    const date = new Date(video.Date);
    const formattedDateKey = date.toDateString();
    const existingPair = dateCountMap.get(formattedDateKey);

    if (existingPair) {
      existingPair.count += 1;
    } else {
      dateCountMap.set(formattedDateKey, { date, count: 1 });
    }
});

    const dateCountPairs = Array.from(dateCountMap.values());
    return dateCountPairs;
  } else {
    return null;
  }
}

export const getMonthlyData = (data: DateCountArray, month: number): DateCountArray => {
  console.log(`Month from monthlyData: ${month}`)
  return data.filter(pair => pair.date.getMonth() === month)
}

export const getLatestMonth = (data: DateCountArray): number | null => {
  const months = data.map(pair => pair.date.getMonth())
  return Math.max(...months);
}

export const getEarliestMonth = (data: DateCountArray): number => {
  const months = data.map(pair => pair.date.getMonth())
  return Math.min(...months);
}

