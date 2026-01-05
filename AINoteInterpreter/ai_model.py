from ctransformers import AutoModelForCausalLM

class AIInterpreter:
    def __init__(self, model_path="./model", model_file="mistral-7b-instruct-v0.2.Q5_K_M.gguf"):
        self.model_path = model_path
        self.model_file = model_file
        self.llm = self._load_model()

    def _load_model(self):
        print(f"--- Initializing Model: {self.model_file} ---")
        try:
            return AutoModelForCausalLM.from_pretrained(
                self.model_path,
                model_file=self.model_file,
                model_type="mistral",
                gpu_layers=33,
                threads=4,
                context_length=1024,
                stream=True
            )
        except Exception as e:
            print(f"Critical Error loading model: {e}")
            return None

    def generate_summary_stream(self, notes_text: str):
        if not self.llm:
            yield b"Error: Model not initialized."
            return

        prompt = f"Summarize these notes and extract 3 keywords:\n\n{notes_text}\n\nSummary:"
        
        try:
            for token in self.llm(prompt, stop=['NOTES:', 'Summary:'], stream=True):
                if token:
                    yield token.encode('utf-8')
        except Exception as e:
            yield f"\n[Inference Error]: {str(e)}".encode('utf-8')

ai_engine = AIInterpreter()