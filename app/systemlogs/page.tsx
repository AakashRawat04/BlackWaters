import { ScrollArea } from "@/components/ui/scroll-area";

const logEntries = [
	{ id: 1, content: "Run actions/checkout@v2", color: "text-blue-400" },
	{
		id: 2,
		content: "Syncing repository: Emurgo/cardano-backend",
		color: "text-blue-400",
	},
	{ id: 3, content: "Getting Git version info", color: "text-blue-400" },
	{
		id: 4,
		content:
			"Temporarily overriding HOME='/home/runner/work/_temp/f537f586-f7dd-4fe3-9fe0-6f9999f6b94a'",
		color: "text-blue-400",
	},
	{
		id: 5,
		content: "before making global git config changes",
		color: "text-blue-400",
	},
	{
		id: 6,
		content:
			"Adding repository directory to the temporary git global config as a safe directory",
		color: "text-green-400",
	},
	{
		id: 7,
		content:
			"/usr/bin/git config --global --add safe.directory /home/runner/work/cardano-backend",
		color: "text-green-400",
	},
	{
		id: 8,
		content:
			"Deleting the contents of '/home/runner/work/cardano-backend/cardano-backend'",
		color: "text-blue-400",
	},
	{ id: 9, content: "Initializing the repository", color: "text-blue-400" },
	{
		id: 10,
		content: "Disabling automatic garbage collection",
		color: "text-blue-400",
	},
	{ id: 11, content: "Setting up auth", color: "text-blue-400" },
	{
		id: 12,
		content:
			"/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
		color: "text-green-400",
	},
	{
		id: 13,
		content:
			"/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :",
		color: "text-green-400",
	},
	{
		id: 14,
		content:
			"/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
		color: "text-green-400",
	},
	{
		id: 15,
		content:
			"/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :",
		color: "text-green-400",
	},
	{
		id: 16,
		content:
			"/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
		color: "text-green-400",
	},
	{ id: 17, content: "Fetching the repository", color: "text-blue-400" },
	{ id: 18, content: "Determining the checkout info", color: "text-blue-400" },
	{ id: 19, content: "Checking out the ref", color: "text-blue-400" },
	{
		id: 20,
		content: "/usr/bin/git log -1 --format='%H'",
		color: "text-green-400",
	},
	{
		id: 21,
		content: "2d804d94ddf2c2d94f9fd19b23a016456b4b4b0",
		color: "text-green-400",
	},
];

export default function SystemLogs() {
	return (
		<div className="flex-1 p-8 bg-[#1a1a1a] text-[#e0e0e0]">
			<h1 className="text-3xl font-bold mb-6">System Logs</h1>
			<ScrollArea className="h-[calc(100vh-8rem)] rounded-md border">
				<div className="p-4">
					{logEntries.map((entry) => (
						<div
							key={entry.id}
							className={`${entry.color} font-mono text-sm mb-1`}
						>
							{entry.content}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
