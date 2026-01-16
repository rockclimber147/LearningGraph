import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from jose import jwt, JWTError

from ai_model import ai_engine
from services import AuthService

app = FastAPI()
gpu_semaphore = asyncio.Semaphore(1)
waiting_count = 0

@app.websocket("/ws/summarize")
async def websocket_endpoint(websocket: WebSocket):
    access_token = websocket.cookies.get("accessToken")
    try:
        AuthService.authenticate(access_token)
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    global waiting_count
    await websocket.accept()
    
    try:
        notes = await websocket.receive_text()
        waiting_count += 1
        
        if gpu_semaphore.locked():
            await websocket.send_text(f"QUEUE_STATUS: Waiting... {waiting_count} people in line.")

        async with gpu_semaphore:
            waiting_count -= 1
            await websocket.send_text("QUEUE_STATUS: Starting your summary now...")
            
            async for token_bytes in ai_engine.generate_summary_stream(notes):
                token = token_bytes.decode('utf-8')
                await websocket.send_text(token)
            
            await websocket.send_text("EOF")


    except WebSocketDisconnect:
        waiting_count = max(0, waiting_count - 1)
        print("User disconnected.")
    except Exception as e:
        await websocket.send_text(f"ERROR: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)