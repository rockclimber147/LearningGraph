import asyncio
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ai_model import ai_engine

app = FastAPI(
    title="AI Note Interpreter",
    description="A FastAPI server for streaming academic summaries",
    version="1.0.0"
)

# 1. Define the Request Schema
class NotesRequest(BaseModel):
    notes: str

# 2. The Streaming Route
@app.post("/summarize")
async def summarize(request: NotesRequest):
    """
    Summarize academic notes using a streaming response.
    """
    if not request.notes:
        raise HTTPException(status_code=400, detail="Missing 'notes' field")

    async def event_generator():
        for token in ai_engine.generate_summary_stream(request.notes):
            yield token
            await asyncio.sleep(0)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"X-Content-Type-Options": "nosniff"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)