from ctransformers import AutoModelForCausalLM

MODEL_FILE = "mistral-7b-instruct-v0.2.Q5_K_M.gguf" 

# Load the model once when the backend starts
try:
    llm = AutoModelForCausalLM.from_pretrained(
        "./model",             # The path where the model file resides
        model_file=MODEL_FILE, 
        model_type="mistral",  
        gpu_layers=50,         
        threads=8,
        max_new_tokens=1024,    
        temperature=0.7
    )
    print(f"**Successfully loaded model: {MODEL_FILE}**")

except Exception as e:
    print(f"Error loading model: {e}")
    llm = None


def interpret_notes(notes_text: str) -> str:
    """Interprets notes by generating a summary."""
    if not llm:
        return "Model not loaded."
    
    prompt = f"""
    You are an expert academic assistant. Summarize the following notes and extract 3 main keywords.
    NOTES:
    ---
    {notes_text}
    ---
    Summary:
    """
    # Remove max_new_tokens=512 here. It will now default to the 1024 set during loading.
    response = llm(prompt, stop=['NOTES:', 'Summary:']) 
    return response

def generate_quiz_question(notes_text: str) -> str:
    """Generates a multiple-choice quiz question from the notes."""
    if not llm:
        return "Model not loaded."

    prompt = f"""
    You are an expert quiz generator. Based on the notes below, generate a single multiple-choice question 
    with 4 options (A, B, C, D) and specify the correct answer. The output must start with 'QUESTION:'
    and end with 'ANSWER: [Correct Letter]'.

    NOTES:
    ---
    {notes_text}
    ---
    """
    # Remove max_new_tokens=512 here. It will now default to the 1024 set during loading.
    response = llm(prompt, stop=['NOTES:', 'ANSWER:'])
    
    # Simple post-processing to ensure the structure is clear
    return response.strip() + "\n\nANSWER: [Specify the correct letter]"


# Example of how you would use it (optional):
if __name__ == '__main__':
    sample_notes = "This hook memoizes a value returned by a function. It caches the results of a function so it's only recalculated when the dependencies change. It can prevent unnecessary function calls when a re render happens.\n\n```text\nimport { useMemo } from \"react\"\n...\n\n  const [count, setCount] = useState(0);\n  const [number, setNumber] = useState(0);\n\n  const squaredNumber = useMemo(() => {\n    // code that takes way too long to run here\n    return number * number;\n  }, [number]);\n```\n\nIn the above example, if count changes the squaredNumber function is not called. It is only called if number changes. Generally, updating state in react re renders the entire component. If count is updated but number stays the same, we don't need to call the squaredNumber function again.\n\nUseMemo adds overhead and stores memory so it's not a great idea to use it everywhere, just in computationally heavy cases where an output is determined entirely by an input (like in the squaredNumber case). If squaredNumber was instead an api call with results that can change (like get the current time), useMemo shouldn't be used here.\n\n`useMemo` can also ensure referential equality. Declaring an object inside a component and using it as a dependency in `useEffect` will trigger the effect on every render because the object gets a new reference each time. Wrapping the object creation in `useMemo` ensures that the object keeps the same reference across renders, so `useEffect` only runs when the actual contents change."
    
    print("\n--- Interpretation ---")
    print(interpret_notes(sample_notes))
    
    print("\n--- Quiz Question ---")
    print(generate_quiz_question(sample_notes))