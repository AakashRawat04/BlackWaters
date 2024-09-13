import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourceUsage() {
	return (
		<div className="flex-1 p-8 bg-[#1a1a1a] text-[#e0e0e0]">
			<h1 className="text-3xl font-bold mb-6">Resource Usage</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
					<CardHeader>
						<CardTitle className="text-[#4ade80]">CPU Usage</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">1.2 GHz</p>
						<p className="text-sm text-[#a0a0a0] mt-2">Architecture: x86_64</p>
						<p className="text-sm text-[#a0a0a0]">Parent Family: Skylake</p>
					</CardContent>
				</Card>
				<Card className="bg-[#2a2a2a] border-[#3a3a3a]">
					<CardHeader>
						<CardTitle className="text-[#4ade80]">Memory Usage</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">12 GB / 16 GB</p>
						<p className="text-sm text-[#a0a0a0] mt-2">75% utilized</p>
					</CardContent>
				</Card>
				<Card className="bg-[#2a2a2a] border-[#3a3a3a] md:col-span-2">
					<CardHeader>
						<CardTitle className="text-[#4ade80]">
							Read / Write Telemetry Data
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">1200 write / 300 reads</p>
						<p className="text-sm text-[#a0a0a0] mt-2">
							The overall Information about the internal Read and writes
							performed on the system.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
