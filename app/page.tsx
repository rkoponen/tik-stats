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
    const dataReveresed = data.reverse();
    const dates = dataReveresed.map(pair => pair.date.toLocaleDateString('fi-FI'));
    const counts = dataReveresed.map(pair => pair.count);
    
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your TikTok Stats</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xl font-semibold text-blue-500 dark:text-blue-300">{videoHistory.length.toLocaleString('fi-FI')}</p>
              <p className="text-lg text-gray-700">TikToks Watched (180 days)</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-xl font-semibold text-pink-500 dark:text-pink-300">{likeList.length.toLocaleString('fi-FI')}</p>
              <p className="text-lg text-gray-700 dark:text-gary-400">TikToks Liked</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{Math.round(averageDailyCount).toLocaleString('fi-FI')}</p>
              <p className="text-lg text-gray-700 dark:text-gray-300">TikToks Watched Daily (Avg)</p>
            </div>
          </div>
          <div className="w-full">
            <BarChart data={chartData} options={chartOptions}/>
          </div>
          <div className="flex justify-center my-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={handleClickPrevious}>&lt; Previous month</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={handleClickNext}>Next month &gt;</button>
          </div>
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
    <main className="flex flex-col items-center justify-between p-24">
      <div className="w-3/4">
        <h1 className="text-4xl mb-4 font-extrabold tracking-tight">TikTok Data</h1>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file-input">Choose a ZIP File</label>        
          <input 
            className="file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
            id="file-input"
            type="file" 
            onChange={handleFileChange} />
          <p className="mt-1 mb-6 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Upload the ZIP file containing your TikTok data.</p>
        </div>
        <ResultWidget/>
      </div>
    </main>

  )
}
