// components/Sidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar, onMouseEnter, onMouseLeave }: SidebarProps) {
  return (
    <aside
      id="sidebar"
      className={`w-72 h-auto max-h-[80vh] bg-[#2a2a2a] text-[#e0e0e0] p-6 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } border border-white rounded-lg shadow-lg`} // White border added
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
      style={{ margin: "15px", marginBottom: "30px" }} // Breathing space
    >
      <Card className="bg-[#3a3a3a] p-4">
        <CardHeader>
          <CardTitle>
            <Link href="/" className="hover:text-[#ffffff] text-2xl font-bold">
              Black Waters
            </Link>
          </CardTitle>
        </CardHeader>
      </Card>

      <nav className="flex flex-col space-y-4 mt-6">
        {/* Card 1: System Logs */}
        <Card className="bg-[#3a3a3a] rounded-2xl shadow-md">
          <CardContent>
            <Link href="/systemlogs" className="hover:text-[#ffffff] uppercase">
              System logs
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Resource Usage */}
        <Card className="bg-[#3a3a3a] rounded-2xl shadow-md">
          <CardContent>
            <Link href="/resourceusage" className="hover:text-[#ffffff] uppercase">
              Resource usage
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Telemetry */}
        <Card className="bg-[#3a3a3a] rounded-2xl shadow-md">
          <CardContent>
            <Link href="/resourcemonitor" className="hover:text-[#ffffff] uppercase">
              Telemetry
            </Link>
          </CardContent>
        </Card>

        {/* Card 4: CPU Usage Graph */}
        <Card className="bg-[#3a3a3a] rounded-2xl shadow-md">
          <CardContent>
            <Link href="/cpuusagegraph" className="hover:text-[#ffffff] uppercase">
              CPU usage Graph
            </Link>
          </CardContent>
        </Card>
      </nav>

      {/* Bottom Image */}
      <div className="flex justify-center mt-6">
        <Image 
          src="/assets/makhi_real.png" // Update the image path accordingly
          alt="Sidebar Image" 
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
    </aside>
  );
}
