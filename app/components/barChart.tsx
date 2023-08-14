import React from "react";
import 'chart.js/auto';
import {Bar} from "react-chartjs-2";
import { ChartOptions } from "chart.js/auto";

export interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  options?: ChartOptions<"bar">;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {

  return (
    <div>
      <Bar style={ {width: '100%'} } data={data} options={options}></Bar>
    </div>
  )
}

export default BarChart;