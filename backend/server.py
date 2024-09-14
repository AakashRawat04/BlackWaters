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

# Create an async Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")

# Create a FastAPI app
app = FastAPI()

# Mount static files (this will serve index.html and other static assets)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Wrap FastAPI app with Socket.IO server
socket_app = socketio.ASGIApp(sio, app)

@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")

@sio.event
async def training_data(sid, data):
    await sio.emit('training_data', data)

@sio.event
async def system_data(sid, data):
    await sio.emit('system_data', data)

@sio.event
async def disconnect(sid):
    pass

# Run the broadcast loop after server starts
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(socket_app, host='127.0.0.1', port=5000)