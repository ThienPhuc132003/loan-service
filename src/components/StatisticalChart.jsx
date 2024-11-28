import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { useTranslation } from "react-i18next"; // Import useTranslation

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const StatisticalChartComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [filter, setFilter] = useState("week");

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data1: [12, 19, 3, 5, 2, 3, 7],
    data2: [2, 3, 20, 5, 1, 4, 9],
  };

  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data1: [65, 59, 80, 81],
    data2: [28, 48, 40, 19],
  };

  const yearlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data1: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 90],
    data2: [28, 48, 40, 19, 86, 27, 90, 50, 60, 80, 85, 95],
  };

  const chartData = {
    labels:
      filter === "week"
        ? weeklyData.labels
        : filter === "month"
        ? monthlyData.labels
        : yearlyData.labels,
    datasets: [
      {
        label: "Data 1",
        data:
          filter === "week"
            ? weeklyData.data1
            : filter === "month"
            ? monthlyData.data1
            : yearlyData.data1,
        backgroundColor: "rgba(255, 94, 58, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: "Data 2",
        data:
          filter === "week"
            ? weeklyData.data2
            : filter === "month"
            ? monthlyData.data2
            : yearlyData.data2,
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
    plugins: {
      datalabels: {
        display: true,
        color: "rgba(39, 46, 79, 0.6)",
        align: "end",
        anchor: "end",
      },
    },
    categoryPercentage: 0.7,
  };

  return (
    <div className="chart-container">
      <div className="filter-buttons">
        <button
          className={filter === "week" ? "active" : ""}
          onClick={() => setFilter("week")}
        >
          {t("common.week")}
        </button>
        <button
          className={filter === "month" ? "active" : ""}
          onClick={() => setFilter("month")}
        >
          {t("common.month")}
        </button>
        <button
          className={filter === "year" ? "active" : ""}
          onClick={() => setFilter("year")}
        >
          {t("common.year")}
        </button>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

StatisticalChartComponent.propTypes = {
  data1: PropTypes.arrayOf(PropTypes.number).isRequired,
  data2: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const StatisticalChart = React.memo(StatisticalChartComponent);
export default StatisticalChart;