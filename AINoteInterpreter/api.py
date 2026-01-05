import time
from flask import Flask, request, Response, stream_with_context
from ctransformers import AutoModelForCausalLM
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)

MODEL_FILE = "mistral-7b-instruct-v0.2.Q5_K_M.gguf"

print(f"Loading {MODEL_FILE} into VRAM...")
try:
    llm = AutoModelForCausalLM.from_pretrained(
        "./model",
        model_file=MODEL_FILE,
        model_type="mistral",
        gpu_layers=33,
        threads=4,
        context_length=1024,
        stream=True
    )
    print("Model ready on GPU!")
except Exception as e:
    print(f"Error: {e}")
    llm = None

def generate_summary(notes_text):
    prompt = f"Summarize these notes and extract 3 keywords:\n\n{notes_text}\n\nSummary:"
    
    start_time = time.time()
    token_count = 0
    
    for token in llm(prompt, stop=['NOTES:', 'Summary:'], stream=True):
        yield token
        token_count += 1
    
    total_time = time.time() - start_time
    tps = token_count / total_time if total_time > 0 else 0
    yield f"\n\n--- SPEED: {tps:.2f} T/s ---"

@app.route('/summarize', methods=['POST'])
def summarize():
    """
    Summarize Academic Notes
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          id: NotesRequest
          properties:
            notes:
              type: string
              description: The academic notes to be summarized
              example: "useMemo caches the results of a function..."
    responses:
      200:
        description: A streamed summary of the notes
    """
    data = request.get_json()
    notes = data.get("notes", "")
    
    def generate_summary(notes_text):
        prompt = f"Summarize these notes and give the top 3 kwywords:\n\n{notes_text}\n\nSummary:"
        for token in llm(prompt, stop=['Summary:'], stream=True):
            yield token

    return Response(
        stream_with_context(generate_summary(notes)),
        mimetype='text/plain',
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked"
        }
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)