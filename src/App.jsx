import React, { useState, useEffect, useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chartRef = useRef(null);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/day-data.json');
        const data = await response.json();

        const processedData = data.map(entry => ({
          date: new Date(entry[0]),
          open: entry[1],
          high: entry[2],
          low: entry[3],
          close: entry[4],
          volume: entry[5],
        }));

        setAllData(processedData);
        setChartData(processedData.slice(0, 10));
        setCurrentIndex(10);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < allData.length) {
        setChartData(prevData => [...prevData, allData[currentIndex]]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, allData]);

  const options = {
    title: {
      text: "Real-Time Stock Data",
    },
    axisX: {
      title: "Time",
      valueFormatString: "DD MMM YYYY HH:mm",
    },
    axisY: {
      title: "Price",
    },
    axisY2: {
      title: "Volume",
    },
    toolTip: {
      shared: true,
      content: "{name}: {y}",
    },
    data: [
      {
        type: "line",
        name: "Open Price",
        showInLegend: true,
        dataPoints: chartData.map(item => ({ x: item.date, y: item.open })),
      },
      {
        type: "line",
        name: "High Price",
        showInLegend: true,
        dataPoints: chartData.map(item => ({ x: item.date, y: item.high })),
      },
      {
        type: "line",
        name: "Low Price",
        showInLegend: true,
        dataPoints: chartData.map(item => ({ x: item.date, y: item.low })),
      },
      {
        type: "line",
        name: "Close Price",
        showInLegend: true,
        dataPoints: chartData.map(item => ({ x: item.date, y: item.close })),
      },
      {
        type: "column",
        name: "Volume",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints: chartData.map(item => ({ x: item.date, y: item.volume })),
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} ref={chartRef} />
    </div>
  );
};

export default App;
