'use client'
import Image from 'next/image'
import { parse } from 'path';
import { useState, useEffect } from 'react';
import { ParsedData, VideoBrowsingHistoryItem, VideoLikeHistoryItem} from './types/jsonInterfaces';
import { json } from 'stream/consumers';
import BarChart from './components/barChart';
import type { BarChartProps } from './components/barChart';
import JSZip from 'jszip';
import { DateCountMap } from './types/dateCountMap';
import { reverseData } from './utils/dataUtils';
import { computeDailyCounts, getLatestMonth, getMonthlyData } from './utils/dateUtils';

enum Months {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}


export default function Home() {
  const [files, setFiles] = useState<ParsedData | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoBrowsingHistoryItem[] | null>(null);
  const [likeList, setLikeList] = useState<VideoLikeHistoryItem[] | null>(null);
  const [chartData, setChartData] = useState<BarChartProps['data'] | null>(null)
  const [averageDailyCount, setAverageDailyCount] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    if (videoHistory) {
      const dailyCounts = computeDailyCounts(videoHistory);
      if (dailyCounts) {
        const totalCount = Object.values(dailyCounts).reduce((sum, count) => sum + count, 0);
        const averageCount = totalCount / Object.keys(dailyCounts).length
        const latestMonth = getLatestMonth(dailyCounts);
        setAverageDailyCount(averageCount)
        if (latestMonth){ 
          setMonth(latestMonth);
          const monthlyData = getMonthlyData(dailyCounts, latestMonth);
          updateChartData(monthlyData, latestMonth)
        }
      }
    }
  }, [videoHistory])



  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('zip')) {
      
      const zip = new JSZip();
      await zip.loadAsync(selectedFile);

      zip.forEach((relativePath, zipEntry) => {
        zipEntry.async('text').then((content) => {
          const jsonData: ParsedData = JSON.parse(content);
          if ("Activity" in jsonData) {
            setFiles(jsonData);
            setVideoHistory(jsonData["Activity"]["Video Browsing History"].VideoList)
            setLikeList(jsonData["Activity"]["Like List"].ItemFavoriteList)
          } else {
            console.log("Invalid json")
          }
        })
      })
    }
  }



  const updateChartData = (data: DateCountMap, month: number) => {
    const reversedDailyCounts = reverseData(data);

    setChartData({
      labels: Object.keys(reversedDailyCounts),
      datasets: [
        {
          label: Months[month],
          data: Object.values(reversedDailyCounts),
          backgroundColor: '#00f2ea',
          borderColor: "#ff0050",
          borderWidth: 1,
        }
      ]
    });
  }

  const ResultWidget = () => {
    if (files && likeList && videoHistory && chartData && averageDailyCount) {
      return (
        <div>
          <p>You have watched {videoHistory.length} Tiktoks</p>
          <p>You have liked {likeList.length} TikToks</p>
          <p>On average, you have watched {Math.round(averageDailyCount)} TikToks daily</p>
          <BarChart data={chartData}/>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClickPrevious}>Previous month</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5" onClick={handleClickNext}>Next month</button>
          <p>{month}</p>
        </div>
      )
    }
  }

  const handleClickPrevious = (e: React.MouseEvent<HTMLElement>) => {
    if (month !== null && month > 0) {
      setMonth(month - 1);
      if (videoHistory) {
        const dailyCounts = computeDailyCounts(videoHistory);
        if (dailyCounts) {
          const monthlyData = getMonthlyData(dailyCounts, month - 1);
          updateChartData(monthlyData, month - 1);
        }
      }
    }
  }

  const handleClickNext = (e: React.MouseEvent<HTMLElement>) => {
    if (month !== null && month < 12) {
      setMonth(month + 1);
      if (videoHistory) {
        const dailyCounts = computeDailyCounts(videoHistory);
        if (dailyCounts) {
          const monthlyData = getMonthlyData(dailyCounts, month + 1);
          updateChartData(monthlyData, month + 1);
        }
      }
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        <form>
          <input type="file" onChange={handleFileChange} />
        </form>
        <ResultWidget/>
      </div>
    </main>

  )
}
