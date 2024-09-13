import asyncio
import socketio
import socketio
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import psutil
import platform
import GPUtil
from time import sleep
import signal
import os
import asyncio
import json

# Create an async Socket.IO client
sio = socketio.AsyncClient()

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

async def send_system_data():
    count = 0
    while True:
        data = {'system_data': f"Training Data {get_real_time_data()}"}
        await sio.emit('system_data', data)
        count += 1
        await asyncio.sleep(1)

@sio.event
async def connect():
    print('Connected to the server!')
    await send_system_data()

@sio.event
async def disconnect():
    pass

# Connect to the server
async def main():
    await sio.connect('http://127.0.0.1:5000')
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())