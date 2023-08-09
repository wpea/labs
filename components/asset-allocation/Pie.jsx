import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// export const data = {
//   labels: [
//     "United Capital",
//     "Lotus Capital",
//     "One17 Capital",
//     "Chapel Hill Denham",
//     "Cardinal Stone",
//   ],
//   datasets: [
//     {
//       label: "Fund Managers",
//       data: [12, 19, 3, 5, 2],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

export default function PieChart({ datum }) {
  const value = {
    labels: [],
    datasets: [
      {
        label: "Fund Managers",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  datum.forEach((obj) => {
    value.labels.push(obj.name);
    value.datasets[0].data.push(parseFloat(obj.total));
  });

  const options = {
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        align: 'left'
      },
    responsive: true,
    },
  };

  return <Pie data={value} options={options} key={Math.random()} />;
}
