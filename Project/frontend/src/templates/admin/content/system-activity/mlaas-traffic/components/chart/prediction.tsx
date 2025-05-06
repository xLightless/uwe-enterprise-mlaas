import React from "react";
import { Bar } from "react-chartjs-2";
import { ModelFeaturesPredicted } from "../../../../../../../common/interfaces";

const LIMEPrediction: React.FC<{ data: ModelFeaturesPredicted }> = ({ data }) => {
    const sortedData = Object.entries(data)
      .filter(([, value]) => typeof value === "number")
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));

    const labels = sortedData.map(([key]) => key);
    const values = sortedData.map(([, value]) => value);
    const backgroundColors = values.map((v) => (v >= 0 ? "#4CAF50" : "#f44336"));

    return (
      <div className="w-full h-full flex items-center justify-center">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Contribution to Prediction",
                data: values,
                backgroundColor: backgroundColors,
                borderRadius: 2,
                barThickness: 20,
              },
            ],
          }}
          options={{
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false, // Ensure the chart can stretch
            plugins: {
              title: {
                display: true,
                font: { size: 18 },
                padding: { bottom: 20 },
              },
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `Contribution: ${context.parsed.x.toFixed(3)}`,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Contribution to Prediction",
                },
                grid: {
                  color: "transparent",
                },
                ticks: {
                  callback: (val) =>
                    typeof val === "number" ? val.toFixed(2) : val,
                },
                min: Math.min(...values),  // Adjust based on your data range
                max: Math.max(...values),   // Adjust based on your data range
              },
              y: {
                ticks: {
                  font: { size: 14 },
                },
                grid: {
                  color: "transparent",
                },
              },
            },
          }}
          style={{ height: '100%', width: '100%' }} // Ensure the chart takes full space
        />
      </div>
    );
};



export default LIMEPrediction;