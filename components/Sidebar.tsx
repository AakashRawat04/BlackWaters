import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#2B2B2B] text-[#e0e0e0] p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-2 border-b pb-2">
        <Link href="/" className="hover:text-[#ffffff]">
          Black Waters
        </Link>
      </h2>
	  <Separator />
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/systemlogs">System logs</Link>
            </Button>
          </li>
          <li>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/resourceusage">Resource usage</Link>
            </Button>
          </li>
          <li>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/resourcemonitor">Telemetry</Link>
            </Button>
          </li>
          <li>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/cpuusagegraph">CPU usage Graph</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}