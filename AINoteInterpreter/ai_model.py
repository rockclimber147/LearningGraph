import httpx
import json

class AIInterpreter:
    def __init__(self, model_name="mistral"):
        self.model_name = model_name
        self.ollama_url = "http://localhost:11434/api/generate"

    async def generate_summary_stream(self, notes_text: str):
        prompt = f"Summarize these notes and extract 3 keywords:\n\n{notes_text}\n\nSummary:"
        
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": True
        }

        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            try:
                async with client.stream("POST", self.ollama_url, json=payload) as response:
                    async for line in response.aiter_lines():
                        if line:
                            chunk = json.loads(line)
                            token = chunk.get("response", "")
                            if token:
                                yield token.encode('utf-8')
                            
                            if chunk.get("done"):
                                break
            except Exception as e:
                yield f"\n[Ollama Error]: {str(e)}".encode('utf-8')

ai_engine = AIInterpreter()