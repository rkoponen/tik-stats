import React, { useState, useEffect } from "react";
import 'chart.js/auto';
import {Bar} from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js/auto";
import { Months } from "../types/months";

export interface BarChartProps {
  data: ChartData<"bar">;
  maxVal: number;
  month: number
}

const BarChart: React.FC<BarChartProps> = ({ data, maxVal, month }) => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    window.onresize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])
  const indexAxis = window.innerWidth > 768 ? 'x' : 'y'

  let scales = windowSize.width > 768 ? 
    { y: { suggestedMax: maxVal, grid: { display: false } }} 
    : { x: { suggestedMax: maxVal, grid: {display: false} } }

  const options: ChartOptions<"bar"> = {
    indexAxis: indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    scales: scales,
    plugins: {
      title: {
        display: true,
        text: `Daily view count (${Months[month]})`,
        font: {
          size: 20,
          weight: 'bold',
        }
      },
      legend: {
        display: false,
      }
    }
  };

  return (
    <div className="w-full h-300 bg-stone-50 rounded-lg p-5">
      <Bar style={ {width: '100%', height: '500px'} } data={data} options={options}></Bar>
    </div>
  )
}

export default BarChart;