export default function Sidebar() {
	return (
		<aside className="w-64 h-screen bg-[#383636] text-[#e0e0e0] p-6">
			<h2 className="text-2xl font-bold mb-6 border-b pb-2">
				Live System Data
			</h2>
			<nav>
				<ul className="space-y-2">
					<li>
						<a href="#" className="hover:text-[#ffffff]">
							System logs
						</a>
					</li>
					<li>
						<a href="#" className="hover:text-[#ffffff]">
							Memory usage
						</a>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
