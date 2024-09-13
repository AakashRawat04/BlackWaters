import psutil
import platform
import GPUtil
import uvicorn
from fastapi import FastAPI, WebSocket
from time import sleep
import signal
import os
import asyncio

app = FastAPI()

def get_real_time_data() -> dict:
    uname = platform.uname()

    cpu_info = {
        "Processor": uname.processor,
        "Cores": psutil.cpu_count(logical=False),
        "Threads": psutil.cpu_count(logical=True),
        "CPU Usage (%)": psutil.cpu_percent(interval=1),
    }

    memory_info = psutil.virtual_memory()
    memory_details = {
        "Total Memory (GB)": round(memory_info.total / (1024 ** 3), 2),
        "Used Memory (GB)": round(memory_info.used / (1024 ** 3), 2),
        "Memory Usage (%)": memory_info.percent
    }

    disk_info = psutil.disk_partitions()
    disk_usage = []
    for partition in disk_info:
        usage = psutil.disk_usage(partition.mountpoint)
        disk_usage.append({
            "Device": partition.device,
            "Mount Point": partition.mountpoint,
            "File System": partition.fstype,
            "Total Size (GB)": round(usage.total / (1024 ** 3), 2),
            "Used (GB)": round(usage.used / (1024 ** 3), 2),
            "Free (GB)": round(usage.free / (1024 ** 3), 2),
            "Usage (%)": usage.percent,
        })

    gpus = GPUtil.getGPUs()
    gpu_details = []
    for gpu in gpus:
        gpu_details.append({
            "GPU Name": gpu.name,
            "GPU Load (%)": gpu.load * 100,
            "Memory Free (MB)": gpu.memoryFree,
            "Memory Used (MB)": gpu.memoryUsed,
            "Memory Total (MB)": gpu.memoryTotal,
            "Temperature (C)": gpu.temperature
        })

    system_data = {
        "cpu_info": cpu_info,
        "memory_info": memory_details,
        "disk_info": disk_usage,
        "gpu_info": gpu_details if gpus else "No GPU detected"
    }

    return system_data

def training_log() -> dict:
    pass
    

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            system_data = get_real_time_data()
            await websocket.send_json(system_data) 
            await asyncio.sleep(2)
    except Exception as e:
        print(f"Connection closed: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws2")
async def websocket_training(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received training data: {data}")
            # training_data = {
            #     "Epoch": 1,
            #     "Batch": 1,
            #     "Loss": 0.1,
            #     "Accuracy": 0.9
            # }
            await websocket.send_json(data)
            await asyncio.sleep(5)
    except Exception as e:
        print(f"Connection closed: {e}")
    finally:
        await websocket.close()

def shutdown_server(sig, frame):
    print("Shutting down server...")
    process = psutil.Process(os.getpid())
    for proc in process.children(recursive=True):
        proc.terminate()
    process.terminate()

signal.signal(signal.SIGINT, shutdown_server)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
