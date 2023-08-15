import React, { useState, useEffect } from "react";
import 'chart.js/auto';
import {Bar} from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js/auto";

export interface BarChartProps {
  data: ChartData<"bar">;
  maxVal: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, maxVal }) => {

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

  const options: ChartOptions<"bar"> = {
    indexAxis: indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        suggestedMax: maxVal,
      },
    },
  };

  return (
    <div className="w-full h-300">
      <Bar style={ {width: '100%', height: '500px'} } data={data} options={options}></Bar>
    </div>
  )
}

export default BarChart;