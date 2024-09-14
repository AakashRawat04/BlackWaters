"use client"
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MyResponsiveLine from '@/components/graphusage'; // Adjust import path as necessary

interface SystemData {
  cpu_info: {
    'CPU Usage (%)': number;
  };
  memory_info: {
    'Memory Usage (%)': number;
  };
}

interface LineChartDataPoint {
  x: string; // Time or X-axis value
  y: number; // Y-axis value
}

interface LineChartSeries {
  id: string; // Identifier for the series (e.g., "CPU Usage")
  color: string; // Color for the series line
  data: LineChartDataPoint[]; // Array of data points
}

const MAX_POINTS = 10; // Maximum number of data points to keep

const App = () => {
  // Initialize state as arrays of LineChartSeries
  const [cpuData, setCpuData] = useState<LineChartSeries[]>([
    { id: 'CPU Usage', color: 'hsl(284, 100%, 52%)', data: [] }
  ]);
  const [memoryData, setMemoryData] = useState<LineChartSeries[]>([
    { id: 'Memory Usage', color: 'hsl(284, 100%, 52%)', data: [] }
  ]);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('system_data', (data: SystemData) => {
      console.log('Received system data:', data);

      // Prepare new data points
      const newCpuPoint: LineChartDataPoint = {
        x: new Date().toLocaleTimeString(),
        y: data.cpu_info['CPU Usage (%)'],
      };

      const newMemoryPoint: LineChartDataPoint = {
        x: new Date().toLocaleTimeString(),
        y: data.memory_info['Memory Usage (%)'],
      };

      // Update CPU data with a fixed length
      setCpuData(prev => {
        const newData = [...prev[0].data, newCpuPoint];
        // Keep only the latest MAX_POINTS points
        return [{
          ...prev[0],
          data: newData.length > MAX_POINTS ? newData.slice(-MAX_POINTS) : newData
        }];
      });

      // Update Memory data with a fixed length
      setMemoryData(prev => {
        const newData = [...prev[0].data, newMemoryPoint];
        // Keep only the latest MAX_POINTS points
        return [{
          ...prev[0],
          data: newData.length > MAX_POINTS ? newData.slice(-MAX_POINTS) : newData
        }];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <div style={{ height: '50%' }}>
        <h2>CPU Usage Over Time</h2>
        <MyResponsiveLine data={cpuData} />
      </div>
      <div style={{ height: '50%' }}>
        <h2>Memory Usage Over Time</h2>
        <MyResponsiveLine data={memoryData} />
      </div>
    </div>
  );
};

export default App;
