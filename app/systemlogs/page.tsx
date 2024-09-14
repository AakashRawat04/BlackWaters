"use client"
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a type for log entry
interface LogEntry {
  id: number;
  epoch: number;
  step: number;
  loss: number;
  gradients: number[];
  train_accuracy: number;
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
    socket.on('training_data', (data: any) => {
      console.log('Received system data:', data);

      // Parse the received data
      let logEntry: LogEntry | null = null;
      try {
        // Ensure data is in the expected format
        logEntry = {
          id: Date.now(), // Generate a unique id
          epoch: data.epoch ?? 0,
          step: data.step ?? 0,
          loss: data.loss ?? 0,
          gradients: data.gradients ?? [],
          train_accuracy: data.train_accuracy ?? 0,
          color: "text-gray-200", // Default color for log text
        };
      } catch (error) {
        console.error("Error parsing log data:", error);
      }

      if (logEntry) {
        // Add the new log entry to the state
        setLogEntries(prevEntries => [...prevEntries, logEntry]);
      }
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
                  className={`font-mono text-sm mb-4 p-4 border border-gray-700 rounded-md shadow-sm ${entry.color}`}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Epoch:</span>
                    <span>{entry.epoch}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Step:</span>
                    <span>{entry.step}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-red-500">Loss:</span>
                    <span>{entry.loss ? entry.loss.toFixed(4) : 'N/A'}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <span className="font-semibold text-blue-500">Gradients:</span>
                    <div className="flex flex-wrap">
                      {entry.gradients.length > 0 ? (
                        entry.gradients.map((gradient, index) => (
                          <span key={index} className="mr-2 text-green-300">{gradient.toFixed(2)}</span>
                        ))
                      ) : (
                        <span className="text-gray-500">No gradients available</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-yellow-500">Train Accuracy:</span>
                    <span>{entry.train_accuracy ? (entry.train_accuracy * 100).toFixed(2) + '%' : 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
