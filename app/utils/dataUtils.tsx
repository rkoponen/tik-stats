import { DateCountMap } from "../types/dateCountMap"

export const reverseData = (data: DateCountMap): DateCountMap => {
  const reversedArray = Object.entries(data).reverse();

    const reversedMap: DateCountMap = {};
    reversedArray.forEach(([date, count]) => {
      reversedMap[date] = count;
  })

  return reversedMap;
}