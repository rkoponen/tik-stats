import React from "react";
import 'chart.js/auto';
import {Bar} from "react-chartjs-2";


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
}


const BarChart: React.FC<BarChartProps> = ({ data }) => {

  return (
    <div>
      <Bar style={ {width: '100%'} } data={data}></Bar>
    </div>
  )
}

export default BarChart;