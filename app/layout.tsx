import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Adjust path if needed

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* Add the <html> tag */}
      <body className="bg-[#101010]"> {/* Add the <body> tag */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-1/4 p-6 rounded-lg bg-[#1a1a1a] border border-white relative h-full">
            {/* Tiles / Cards */}
            <div className="space-y-6">
              {/* Dashboard Card */}
              <Card className="bg-[#2a2a2a] text-white border-none rounded-lg shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-bold text-green-400">Dashboard</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Access your telemetry systems, monitor real-time data, and more.
                  </p>
                  <Link href="/dashboard" className="text-green-400 underline">
                    Go to Dashboard
                  </Link>
                </CardContent>
              </Card>

              {/* Reports Card */}
              <Card className="bg-[#2a2a2a] text-white border-none rounded-lg shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-bold text-green-400">Reports</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    View past reports, analyze trends, and download your data logs.
                  </p>
                  <Link href="/reports" className="text-green-400 underline">
                    View Reports
                  </Link>
                </CardContent>
              </Card>

              {/* Settings Card */}
              <Card className="bg-[#2a2a2a] text-white border-none rounded-lg shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-bold text-green-400">Settings</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Customize your system preferences and alert configurations.
                  </p>
                  <Link href="/settings" className="text-green-400 underline">
                    Configure Settings
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Image */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Image
                src="/assets/makhi_real.png"
                alt="Illustration of Black Water Asset"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-10 overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
