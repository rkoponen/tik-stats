'use client'
import { useState, useEffect } from 'react';
import { ParsedData, VideoBrowsingHistoryItem, VideoLikeHistoryItem} from './types/jsonInterfaces';
import JSZip from 'jszip';
import { StatsWidget } from './components/statsWidget';

export type WatchData = {
  watchHistory: VideoBrowsingHistoryItem[];
  likeHistory: VideoLikeHistoryItem[];
}

export default function Home() {
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('zip')) {
      
      const zip = new JSZip();
      await zip.loadAsync(selectedFile);

      zip.forEach((relativePath, zipEntry) => {
        zipEntry.async('text').then((content) => {
          try {
            const jsonData: ParsedData = JSON.parse(content);
            if ("Activity" in jsonData) {
              const watchHistory = jsonData["Activity"]["Video Browsing History"].VideoList.map((item) => ({...item, Date: new Date(item.Date)}))
              const likeHistory = jsonData["Activity"]["Like List"].ItemFavoriteList;
              setWatchData({ watchHistory: watchHistory, likeHistory: likeHistory})
              setError(null);
            }
          } catch {
            setError("Error parsing JSON data. Please upload a valid JSON file.")
          }
        })
      })
    } else {
      setError('Invalid file type. Please upload a .zip file.')
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl mb-4 font-extrabold tracking-tight text-center">TikStats</h1>
        <div className="flex flex-col items-center">
          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file-input">Choose a ZIP File</label>        
          <input 
            className="file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
            id="file-input"
            type="file" 
            onChange={handleFileChange} />
          <p className="mt-1 mb-6 text-sm text-gray-500" id="file_input_help">Upload the ZIP file containing your TikTok data.</p>
        </div>
        {watchData && (
          <StatsWidget
            watchData={watchData}
          />
        )}
        {error && (
          <div className="bg-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )
        }
      </div>
    </main>

  )
}
