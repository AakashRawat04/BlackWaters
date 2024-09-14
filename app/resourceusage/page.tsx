"use client"
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define types for the data
interface DiskInfo {
  Device: string;
  'Total Size (GB)': number;
  'Used (GB)': number;
  'Free (GB)': number;
  'Usage (%)': number;
}

interface SystemData {
  cpu_info: {
    Processor: string;
    Cores: number;
    Threads: number;
    'CPU Usage (%)': number;
  };
  memory_info: {
    'Total Memory (GB)': number;
    'Used Memory (GB)': number;
    'Memory Usage (%)': number;
  };
  disk_info: DiskInfo[];
  gpu_info: string;
}

// Set up the WebSocket URL
const SOCKET_URL = 'http://127.0.0.1:5000';

export default function ResourceUsage() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const socket = io(SOCKET_URL);

    // Handle incoming system data
    socket.on('system_data', (data) => {
		console.log("system_data", systemData)
      console.log('Received system data:', data);

      // Parse the received data
      try {
        const parsedData = data;
		console.log("parsedData", parsedData)
        setSystemData(parsedData);
      } catch (error) {
        console.error('Error parsing system data:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex-1 p-8 bg-[#1a1a1a] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold mb-6">Resource Usage</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader>
            <CardTitle className="text-[#4ade80]">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemData ? `${systemData.cpu_info['CPU Usage (%)']}%` : 'Loading...'}
            </p>
            <p className="text-sm text-[#a0a0a0] mt-2">
              {systemData ? `Processor: ${systemData.cpu_info.Processor}, Cores: ${systemData.cpu_info.Cores}, Threads: ${systemData.cpu_info.Threads}` : 'Loading...'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader>
            <CardTitle className="text-[#4ade80]">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemData
                ? `${systemData.memory_info['Used Memory (GB)']} GB / ${systemData.memory_info['Total Memory (GB)']} GB`
                : 'Loading...'}
            </p>
            <p className="text-sm text-[#a0a0a0] mt-2">
              {systemData ? `${systemData.memory_info['Memory Usage (%)']}% utilized` : 'Loading...'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#2a2a2a] border-[#3a3a3a] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#4ade80]">Disk Information</CardTitle>
          </CardHeader>
          <CardContent>
            {systemData ? (
              <div>
                {systemData.disk_info.map((disk, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-lg font-bold">
                      {`Disk ${index + 1}: ${disk.Device}`}
                    </p>
                    <p className="text-sm text-[#a0a0a0] mt-1">
                      {`Total Size: ${disk['Total Size (GB)']} GB, Used: ${disk['Used (GB)']} GB, Free: ${disk['Free (GB)']} GB, Usage: ${disk['Usage (%)']}%`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              'Loading...'
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#2a2a2a] border-[#3a3a3a] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#4ade80]">GPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {systemData ? systemData.gpu_info : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
