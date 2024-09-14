"use client"
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight } from "lucide-react";

const SOCKET_URL = 'http://127.0.0.1:5000';

export default function ResourceMonitor() {
  const [cpuUsages, setCpuUsages] = useState<number[]>([]);
  const [memoryUsages, setMemoryUsages] = useState<number[]>([]);
  const [isUnderHighPressure, setIsUnderHighPressure] = useState<{ cpu: boolean, memory: boolean }>({
    cpu: false,
    memory: false
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('system_data', (data) => {
      try {
        const parsedData = data;
        const cpuUsage = parsedData.cpu_info['CPU Usage (%)'];
        const memoryUsage = parsedData.memory_info['Memory Usage (%)'];

        setCpuUsages(prev => {
          const updated = [...prev, cpuUsage].slice(-5);
          return updated;
        });

        setMemoryUsages(prev => {
          const updated = [...prev, memoryUsage].slice(-5);
          return updated;
        });

        // Calculate averages
        const avgCpuUsage = cpuUsages.length > 0 ? cpuUsages.reduce((acc, val) => acc + val, 0) / cpuUsages.length : 0;
        const avgMemoryUsage = memoryUsages.length > 0 ? memoryUsages.reduce((acc, val) => acc + val, 0) / memoryUsages.length : 0;

        // Determine if resources are under high pressure
        setIsUnderHighPressure({
          cpu: avgCpuUsage > 50,
          memory: avgMemoryUsage > 50
        });

        // Update recommendations
        const newRecommendations = [];
        if (avgCpuUsage > 50) newRecommendations.push("Upgrade CPU");
        if (avgMemoryUsage > 50) newRecommendations.push("Upgrade Memory");

        setRecommendations(newRecommendations);

      } catch (error) {
        console.error('Error parsing system data:', error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [cpuUsages, memoryUsages]);

return (
	<div className="flex-1 p-8 bg-[#1a1a1a] text-[#e0e0e0]">
		<h1 className="text-3xl font-bold mb-6">Resource Monitor</h1>

		{isUnderHighPressure.cpu || isUnderHighPressure.memory ? (
			<Alert variant="destructive" className="mb-6">
				<AlertTriangle className="h-4 w-4" />
				<AlertTitle>System is under high pressure</AlertTitle>
				<AlertDescription>
					Elements under pressure:{" "}
					{isUnderHighPressure.cpu && <span className="font-bold text-red-500">CPU</span>}
					{isUnderHighPressure.cpu && isUnderHighPressure.memory && ", "}
					{isUnderHighPressure.memory && <span className="font-bold text-red-500">Memory</span>}
				</AlertDescription>
			</Alert>
		) : (
			<Alert variant="default" className="mb-6 bg-green-500 text-green-900">
          <AlertTitle>All systems working fine</AlertTitle>
          <AlertDescription>All systems are working under normal conditions.</AlertDescription>
        </Alert>
		)}

		<Card className="bg-[#2a2a2a] border-[#3a3a3a] mb-6">
			<CardHeader>
				<CardTitle className="text-[#4ade80]">Recommendation</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="mb-2">
					Allocate <span className="text-[#4ade80]">system runner 1</span> more resources
				</p>
				<h3 className="font-semibold mb-2">Suggested changes:</h3>
				<ul className="space-y-2">
					{recommendations.map((rec, index) => (
						<li key={index} className="flex items-center">
							<span className="mr-2">{rec}</span>
							<ArrowRight className="h-4 w-4 mx-2" />
							<span className="font-bold">{rec === "Upgrade CPU" ? "5.2Ghz" : "32GB"}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
				<CardHeader>
					<CardTitle className="text-[#4ade80]">CPU Usage</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-4xl font-bold">
						{cpuUsages.length > 0 ? `${cpuUsages[cpuUsages.length - 1]}%` : 'Loading...'}
					</p>
					<p className="text-sm text-[#a0a0a0] mt-2">Current: 2.4Ghz</p>
				</CardContent>
			</Card>
			<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
				<CardHeader>
					<CardTitle className="text-[#4ade80]">Memory Usage</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-4xl font-bold">
						{memoryUsages.length > 0 ? `${memoryUsages[memoryUsages.length - 1]}%` : 'Loading...'}
					</p>
					<p className="text-sm text-[#a0a0a0] mt-2">Current: 16GB</p>
				</CardContent>
			</Card>
		</div>
	</div>
);
}
