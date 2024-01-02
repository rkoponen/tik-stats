import { useEffect, useState } from "react";
import { WatchData } from "../page";
import { DateCountArray } from "../types/dateCountArray";
import { Months } from "../types/months";
import { calculateTotalCount, calculateWatchTime, getMaxViews } from "../utils/dataUtils";
import { computeDailyCounts, getEarliestMonth, getLatestMonth, getMonthlyData } from "../utils/dateUtils";
import BarChart, { BarChartProps } from "./barChart";

interface StatsWidgetProps {
  watchData: WatchData
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  watchData
}) => {
  const [chartData, setChartData] = useState<BarChartProps['data'] | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    const dailyCounts = computeDailyCounts(watchData.watchHistory);
    const latestMonth = getLatestMonth(dailyCounts);
    setMonth(latestMonth);
    const monthlyData = getMonthlyData(dailyCounts, latestMonth);
    updateChartData(monthlyData, latestMonth);
  }, [watchData])

  const watchHistory = watchData.watchHistory;
  const likeHistory = watchData.likeHistory;

  const watchTime = calculateWatchTime(watchHistory);
  const dailyCounts = computeDailyCounts(watchHistory);

  const averageDailyCount = calculateTotalCount(dailyCounts) / dailyCounts.length;

  const maxViews = getMaxViews(dailyCounts);

  const earliestMonth = getEarliestMonth(dailyCounts);
  const latestMonth = getLatestMonth(dailyCounts);


  const updateChartData = (data: DateCountArray, month: number) => {
    const dates = data.map(pair => pair.date.toLocaleDateString('fi-FI'));
    const counts = data.map(pair => pair.count);
    if (month) {
      setChartData({
        labels: dates,
        datasets: [
          {
            label: Months[month],
            data: counts,
            backgroundColor: '#ec4899',
            borderColor: "black",
            borderWidth: 0,
          }
        ],
      },
      );
    }
  }

  const handleClickPrevious = (e: React.MouseEvent<HTMLElement>) => {
    if (month !== null && month > 0) {
      setMonth(month - 1);
        const dailyCounts = computeDailyCounts(watchHistory);
        if (dailyCounts) {
          const monthlyData = getMonthlyData(dailyCounts, month - 1);
          updateChartData(monthlyData, month - 1);
        }
    }
  }
  const handleClickNext = (e: React.MouseEvent<HTMLElement>) => {
    if (month !== null && month < 11) {
      setMonth(month + 1);
        const dailyCounts = computeDailyCounts(watchHistory);
        if (dailyCounts) {
          const monthlyData = getMonthlyData(dailyCounts, month + 1);
          updateChartData(monthlyData, month + 1);
        }
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your TikTok Stats (past 180 days)</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-blue-500">{watchHistory.length.toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Watched</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-pink-500">{likeHistory.length.toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Liked (all time)</p>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-teal-500">{Math.round(averageDailyCount).toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Watched Daily (Avg)</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-purple-500">{watchTime.hours}h {watchTime.minutes}min</p>
          <p className="text-lg text-gray-700">Total Time Spent Watching TikToks</p>
        </div>
      </div>
      <div className="mt-8">
        {maxViews && month && chartData && (
          <BarChart data={chartData} maxVal={maxViews} month={month}/>
        )
        }
      </div>
      <div className="flex justify-center my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-4 disabled:opacity-50" onClick={handleClickPrevious} disabled={earliestMonth === month}>&lt; Previous</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-4 disabled:opacity-50" onClick={handleClickNext} disabled={latestMonth === month}>Next &gt;</button>
      </div>
    </div>
  )
}