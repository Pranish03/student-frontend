import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
);

export const Chart = () => {
  const data = {
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
    datasets: [
      {
        label: "New Enrollments",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 70, 85, 90, 95],
        borderColor: "rgb(22, 163, 74)",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(22, 163, 74)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Enrollment Trends (2026)",
        font: { size: 16, weight: "500" },
        color: "#18181b",
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e4e4e7" },
        title: {
          display: true,
          text: "Number of Students",
          font: { size: 12 },
          color: "#71717a",
        },
        ticks: { color: "#3f3f46" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#3f3f46" },
      },
    },
  };

  return <Line data={data} options={options} />;
};
