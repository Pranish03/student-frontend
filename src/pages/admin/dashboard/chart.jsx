import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function AdminDashboard() {
 
  const courseData = {
    labels: ["WebTechnology", "DAA", "DDA", "Simulation & Modelling", "Cryptography","Computer Ethics"],
    datasets: [
      {
        label: "Total Students",
        data: [40, 35, 50, 25, 30, 45], 
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(53, 190, 299, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const courseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Total Students per Course",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Students", font: { size: 14 } },
      },
      x: {
        title: { display: true, text: "Courses", font: { size: 14 } },
      },
    },
  };

  return (
    <div className="p-6  min-h-screen flex justify-start">
     
      <div className="w-full lg:w-3/4">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center">
          <div className="bg-white shadow-lg p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-blue-600">1200</h2>
            <p className="text-gray-600 mt-2">Total Students</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-red-600">85</h2>
            <p className="text-gray-600 mt-2">Total Teachers</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-green-600">45</h2>
            <p className="text-gray-600 mt-2">Total Courses</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-purple-600">320</h2>
            <p className="text-gray-600 mt-2">Total Classes</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg h-[450px]">
          <Bar data={courseData} options={courseOptions} />
        </div>

      </div>

      <div className="hidden lg:block lg:w-1/4"></div>
    </div>
  );
}