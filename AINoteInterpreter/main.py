import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from jose import jwt, JWTError

from ai_model import ai_engine
from services import AuthService, AiService

app = FastAPI()
gpu_semaphore = asyncio.Semaphore(1)
waiting_count = 0

@app.websocket("/ws/summarize")
async def websocket_endpoint(websocket: WebSocket):
    access_token = websocket.cookies.get("accessToken")
    try:
        user_payload = AuthService.authenticate(access_token)
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    
    try:
        notes = await websocket.receive_text()
        await AiService.get_summary_stream(notes, websocket)

    except WebSocketDisconnect:
        AiService.decrement_waiting_count()
        print(f"User {user_payload.get('sub')} disconnected.")
    except Exception as e:
        await websocket.send_text(f"ERROR: {str(e)}")


    except WebSocketDisconnect:
        waiting_count = max(0, waiting_count - 1)
        print("User disconnected.")
    except Exception as e:
        await websocket.send_text(f"ERROR: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)