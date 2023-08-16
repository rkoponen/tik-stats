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
import { StatsWidget } from './components/statsWidget';

export enum Months {
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
    const dataReveresed = data.reverse();
    const dates = dataReveresed.map(pair => pair.date.toLocaleDateString('fi-FI'));
    const counts = dataReveresed.map(pair => pair.count);
    
    setChartData({
      labels: dates,
      datasets: [
        {
          label: Months[month],
          data: counts,
          backgroundColor: '#d9f99d',
          borderColor: "black",
          borderWidth: 1,
        }
      ],
    },
    );
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
    <main className="flex flex-col items-center justify-between p-24">
      <div className="px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl mb-4 font-extrabold tracking-tight text-center">TikTok Data</h1>
        <div className="flex flex-col items-center">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file-input">Choose a ZIP File</label>        
          <input 
            className="file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
            id="file-input"
            type="file" 
            onChange={handleFileChange} />
          <p className="mt-1 mb-6 text-sm text-gray-500" id="file_input_help">Upload the ZIP file containing your TikTok data.</p>
        </div>
        {videoHistory && likeList && chartData && averageDailyCount && month && dailyCounts && (
          <StatsWidget
            videoHistory={videoHistory}
            likeList={likeList}
            averageDailyCount={averageDailyCount}
            month={month}
            chartData={chartData}
            maxVal={getMaxViews(dailyCounts)}
            handleClickPrevious={handleClickPrevious}
            handleClickNext={handleClickNext}
          />
        )}
      </div>
    </main>

  )
}
