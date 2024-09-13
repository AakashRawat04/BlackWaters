// components/Sidebar.tsx
import Link from "next/link";

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
      className={`w-72 h-auto max-h-screen bg-[#2a2a2a] text-[#e0e0e0] p-6 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } border border-white rounded-lg shadow-lg`} // White border added
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave} 
      style={{ margin: '15px' }} // Breathing space on all sides
    >
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        <Link href="/" className="hover:text-[#ffffff]">
          Black Waters
        </Link>
      </h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/systemlogs" className="hover:text-[#ffffff]">
              System logs
            </Link>
          </li>
          <li>
            <Link href="/resourceusage" className="hover:text-[#ffffff]">
              Resource usage
            </Link>
          </li>
          <li>
            <Link href="/resourcemonitor" className="hover:text-[#ffffff]">
              Telemetry
            </Link>
          </li>
          <li>
            <Link href="/cpuusagegraph" className="hover:text-[#ffffff]">
              CPU usage Graph
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
