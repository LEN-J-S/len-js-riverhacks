import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface VoteResultsChartProps {
  results: {
    yes: number;
    no: number;
    unsure: number;
  };
  totalVotes: number;
}

const VoteResultsChart: React.FC<VoteResultsChartProps> = ({ results, totalVotes }) => {
  const data = {
    labels: ['Yes', 'No', 'Unsure'],
    datasets: [
      {
        data: [results.yes, results.no, results.unsure],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderColor: ['#388E3C', '#D32F2F', '#FFA000'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = totalVotes === 0 ? 0 : Math.round((value / totalVotes) * 100);
            return `${context.label}: ${value} votes (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="h-64 mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default VoteResultsChart;