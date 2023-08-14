'use client'
import Image from 'next/image'
import { parse } from 'path';
import { useState, useEffect } from 'react';
import { ParsedData, VideoBrowsingHistoryItem, VideoLikeHistoryItem} from './types/jsonInterfaces';
import { json } from 'stream/consumers';
import BarChart from './components/barChart';
import type { BarChartProps } from './components/barChart';
import JSZip from 'jszip';
import { DateCountArray } from './types/dateCountArray';
import { calculateTotalCount, getMaxViews, reverseData } from './utils/dataUtils';
import { computeDailyCounts, getLatestMonth, getMonthlyData } from './utils/dateUtils';
import { ChartOptions } from 'chart.js';

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
  const [chartOptions, setChartOptions] = useState<ChartOptions<"bar">>({
      scales: {
          y: {
            suggestedMax: 0
          },
        },
    })
  const [dailyCounts, setDailyCounts] = useState<DateCountArray | null>(null);

  useEffect(() => {
    if (videoHistory) {
      const dailyCounts = computeDailyCounts(videoHistory);
      if (dailyCounts) {
        setDailyCounts(dailyCounts)
        const totalCount = calculateTotalCount(dailyCounts);
        const averageCount = totalCount / dailyCounts.length;
        const latestMonth = getLatestMonth(dailyCounts);
        getMaxViews(dailyCounts)
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



  const updateChartData = (data: DateCountArray, month: number) => {
    const dates = data.map(pair => pair.date.toLocaleDateString('fi-FI'));
    const counts = data.map(pair => pair.count);


    setChartData({
      labels: dates,
      datasets: [
        {
          label: Months[month],
          data: counts,
          backgroundColor: '#00f2ea',
          borderColor: "#ff0050",
          borderWidth: 1,
        }
      ],
    },
    );
    if (dailyCounts) {
      const newChartOptions: ChartOptions<"bar"> = {
        scales: {
          y: {
            suggestedMax: getMaxViews(dailyCounts),
          },
        },
      };
  
      setChartOptions(newChartOptions);
    }
    
  }

  const ResultWidget = () => {
    if (files && likeList && videoHistory && chartData && averageDailyCount && chartOptions) {
      return (
        <div>
          <p>You have watched {videoHistory.length} Tiktoks</p>
          <p>You have liked {likeList.length} TikToks</p>
          <p>On average, you have watched {Math.round(averageDailyCount)} TikToks daily</p>
          <BarChart data={chartData} options={chartOptions}/>
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
