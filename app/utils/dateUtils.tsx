import { DateCountMap } from "../types/dateCountMap";
import { VideoBrowsingHistoryItem } from "../types/jsonInterfaces";

export const computeDailyCounts = (videoHistory: VideoBrowsingHistoryItem[]): DateCountMap | null => {
  if (videoHistory) {
    const counts: { [date: string]: number } = {};

    videoHistory.forEach(video => {
      const dateKey = new Date(video.Date).toISOString().split("T")[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    return counts;
  } else {
    return null;
  }
}

export const getMonthlyData = (data: DateCountMap, month: number): DateCountMap => {
  console.log(`Month from monthlyData: ${month}`)
  const monthlyData: { [date: string]: number }= {};
  for (const dateKey in data) {
    const currentDate = new Date(dateKey);
    if (currentDate.getMonth() == month) {
      monthlyData[dateKey] = data[dateKey]
    }
  }
  console.log(monthlyData)
  return monthlyData
}

export const getLatestMonth = (data: DateCountMap): number | null => {
  let latestDate: Date | null = null;
  let foundValidDate = false;

  for (const dateKey in data) {
    const currentDate = new Date(dateKey);
    if (!foundValidDate || (latestDate && currentDate > latestDate)) {
      latestDate = currentDate;
      foundValidDate = true;
    }
  }
  if (latestDate) {
    const monthNumber = new Date(latestDate).getMonth()
    return monthNumber
  } else {
    return null;
  }
}

