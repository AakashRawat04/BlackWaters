import Link from "next/link";

export default function Sidebar() {
	return (
		<aside className="w-64 h-screen bg-[#1a1a1a] text-[#e0e0e0] p-6">
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
						<Link href="#" className="hover:text-[#ffffff]">
							Memory usage
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
