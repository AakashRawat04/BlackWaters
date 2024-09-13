"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const generateRandomData = (count: number) => {
	const data = [];
	const currentTime = new Date();
	for (let i = 0; i < count; i++) {
		data.push({
			time: new Date(
				currentTime.getTime() - (count - i) * 60000
			).toLocaleTimeString(),
			usage: Math.floor(Math.random() * 100),
		});
	}
	return data;
};

export default function MemoryUsageGraph() {
	const [data, setData] = useState(generateRandomData(30));

	useEffect(() => {
		setData((prevData) => {
			const newData = [
				...prevData.slice(1),
				{
					time: new Date().toLocaleTimeString(),
					usage: Math.floor(Math.random() * 100),
				},
			];
			return newData;
		});
	}, []);

	return (
		<div className="flex flex-col h-screen bg-[#1a1a1a] text-[#e0e0e0]">
			<h1 className="text-3xl font-bold p-8 pb-4">Memory Usage Graph</h1>
			<div className="flex-grow p-8 pt-0">
				<Card className="w-full h-full bg-[#2a2a2a] border-[#3a3a3a]">
					<CardHeader>
						<CardTitle className="text-[#FF6B6B]">
							Memory Usage Over Time
						</CardTitle>
					</CardHeader>
					<CardContent className="h-[calc(100%-5rem)]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data}>
								<CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
								<XAxis dataKey="time" stroke="#e0e0e0" />
								<YAxis stroke="#e0e0e0" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#2a2a2a",
										border: "none",
										color: "#e0e0e0",
									}}
									labelStyle={{ color: "#e0e0e0" }}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="usage"
									stroke="#FF6B6B"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
