import { DateCountArray, DateCount } from "../types/dateCountArray"

export const reverseData = (data: DateCountArray): DateCountArray => {
  return data.reverse();
}

export const getMaxViews = (data: DateCountArray): number => {
  return Math.max(...data.map(pair => pair.count))
}

export const calculateTotalCount = (data: DateCountArray): number => {
  return data.reduce((total, pair) => total + pair.count, 0);
}