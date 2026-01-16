import asyncio
from fastapi import WebSocket

from ai_model import ai_engine

class AiService:
    _gpu_semaphore = asyncio.Semaphore(1)
    _waiting_count = 0

    @classmethod
    async def get_summary_stream(cls, notes: str, websocket: WebSocket):
        cls._waiting_count += 1
        in_line = True
        
        try:
            if cls._gpu_semaphore.locked():
                await websocket.send_text(f"QUEUE_STATUS: Waiting... {cls._waiting_count} people in line.")

            async with cls._gpu_semaphore:
                cls._waiting_count -= 1
                await websocket.send_text("QUEUE_STATUS: Starting your summary now...")
                
                async for token_bytes in ai_engine.generate_summary_stream(notes):
                    token = token_bytes.decode('utf-8')
                    await websocket.send_text(token)
                
                await websocket.send_text("EOF")

        finally:
            if in_line:
                cls.decrement_waiting_count()

    @classmethod
    def decrement_waiting_count(cls):
        cls._waiting_count = max(0, cls._waiting_count - 1)