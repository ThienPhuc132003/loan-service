import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";
import "../assets/css/StatisticalChart.style.css";

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticalChartComponent = ({ data1, data2, labels }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Data 1",
        data: data1,
        backgroundColor: "rgba(255, 94, 58, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: "Data 2",
        data: data2,
        backgroundColor: "rgba(39, 46, 79, 1)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

StatisticalChartComponent.propTypes = {
  data1: PropTypes.arrayOf(PropTypes.number).isRequired,
  data2: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const StatisticalChart = React.memo(StatisticalChartComponent);
export default StatisticalChart;