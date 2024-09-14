"use client"
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a type for log entry
interface LogEntry {
  id: number;
  content: string;
  color: string;
}

// Set up the WebSocket URL
const SOCKET_URL = 'http://127.0.0.1:5000';

export default function SystemLogs() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); // Reference for the scroll container

  useEffect(() => {
    // Establish WebSocket connection
    const socket = io(SOCKET_URL);

    // Handle incoming system data
    socket.on('system_data', (data: string) => {
      console.log('Received system data:', data);

      // Parse the received data
      let logContent = "";
      try {
        // Format the content for display
        logContent = formatLogContent(data);
      } catch (error) {
        logContent = "Error parsing log data";
        console.error("Error parsing log data:", error);
      }

      // Create a log entry
      const logEntry: LogEntry = {
        id: Date.now(), // Generate a unique id
        content: logContent,
        color: "text-gray-200", // Default color for log text
      };

      // Add the new log entry to the state
      setLogEntries(prevEntries => [...prevEntries, logEntry]);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Scroll to the bottom of the scroll container whenever logEntries change
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logEntries]);

  // Function to format log content
  function formatLogContent(data: any): string {
    // Customize this function to format the log content as needed
    return `Log Data:\n${JSON.stringify(data, null, 2)}`;
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold p-8 pb-4">System Logs</h1>
      <div className="flex-grow overflow-hidden p-8 pt-0">
        <ScrollArea
          ref={scrollRef} // Attach the ref to the scroll area
          className="h-full rounded-md border border-[#3a3a3a] bg-[#2a2a2a]"
        >
          <div className="p-4" id="logs">
            {logEntries.length === 0 ? (
              <div className="text-gray-500">No logs available</div>
            ) : (
              logEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`${entry.color} font-mono text-sm mb-2 p-4 border border-gray-700 rounded-md shadow-sm`}
                >
                  {entry.content}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
