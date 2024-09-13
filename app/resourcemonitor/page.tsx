import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function ResourceMonitor() {
	return (
		<div className="flex-1 p-8 bg-[#1a1a1a] text-[#e0e0e0]">
			<h1 className="text-3xl font-bold mb-6">Resource Monitor</h1>

			<Alert variant="destructive" className="mb-6">
				<AlertTriangle className="h-4 w-4" />
				<AlertTitle>System is under high pressure</AlertTitle>
				<AlertDescription>
					Elements under pressure:{" "}
					<span className="font-bold text-red-500">CPU</span>,{" "}
					<span className="font-bold text-red-500">Memory</span>
				</AlertDescription>
			</Alert>

			<Card className="bg-[#2a2a2a] border-[#3a3a3a] mb-6">
				<CardHeader>
					<CardTitle className="text-[#4ade80]">Recommendation</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-2">
						Allocate <span className="text-[#4ade80]">system runner 1</span>{" "}
						more resources
					</p>
					<h3 className="font-semibold mb-2">Suggested changes:</h3>
					<ul className="space-y-2">
						<li className="flex items-center">
							<span className="mr-2">CPU upgrade from 2.4Ghz</span>
							<ArrowRight className="h-4 w-4 mx-2" />
							<span className="font-bold">5.2Ghz</span>
						</li>
						<li className="flex items-center">
							<span className="mr-2">Memory upgrade from 16GB</span>
							<ArrowRight className="h-4 w-4 mx-2" />
							<span className="font-bold">32GB</span>
						</li>
					</ul>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
					<CardHeader>
						<CardTitle className="text-[#4ade80]">CPU Usage</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">98%</p>
						<p className="text-sm text-[#a0a0a0] mt-2">Current: 2.4Ghz</p>
					</CardContent>
				</Card>
				<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
					<CardHeader>
						<CardTitle className="text-[#4ade80]">Memory Usage</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">94%</p>
						<p className="text-sm text-[#a0a0a0] mt-2">Current: 16GB</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
