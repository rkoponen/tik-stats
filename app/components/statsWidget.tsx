import { VideoBrowsingHistoryItem, VideoLikeHistoryItem } from "../types/jsonInterfaces";
import BarChart, { BarChartProps } from "./barChart";

interface StatsWidgetProps {
  videoHistory: VideoBrowsingHistoryItem[];
  likeList: VideoLikeHistoryItem[];
  averageDailyCount: number;
  month: number;
  chartData: BarChartProps['data'];
  maxVal: number;
  handleClickPrevious: (e: React.MouseEvent<HTMLElement>) => void;
  handleClickNext: (e: React.MouseEvent<HTMLElement>) => void;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  videoHistory,
  likeList,
  averageDailyCount,
  month,
  chartData,
  maxVal,
  handleClickPrevious,
  handleClickNext
}) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your TikTok Stats</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-blue-500">{videoHistory.length.toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Watched (180 days)</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-pink-500">{likeList.length.toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Liked</p>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold text-gray-700">{Math.round(averageDailyCount).toLocaleString('fi-FI')}</p>
          <p className="text-lg text-gray-700">TikToks Watched Daily (Avg)</p>
        </div>
      </div>
      <div className="mt-8">
        <BarChart data={chartData} maxVal={maxVal} month={month}/>
      </div>
      <div className="flex justify-center my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={handleClickPrevious}>&lt; Previous</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={handleClickNext}>Next &gt;</button>
      </div>
    </div>
  )
}