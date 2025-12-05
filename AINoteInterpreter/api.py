from flask import Flask, request, jsonify
from ai_core import interpret_notes, generate_quiz_question 

app = Flask(__name__)

@app.route('/interpret', methods=['POST'])
def handle_interpret():
    """Endpoint to get a summary and keywords for a block of notes."""
    data = request.get_json()
    notes = data.get('notes', '')
    
    if not notes:
        return jsonify({"error": "No notes provided"}), 400

    # Call the model logic
    interpretation = interpret_notes(notes)
    
    return jsonify({
        "status": "success",
        "result": interpretation
    })

@app.route('/quiz', methods=['POST'])
def handle_quiz():
    """Endpoint to generate a quiz question from a block of notes."""
    data = request.get_json()
    notes = data.get('notes', '')

    if not notes:
        return jsonify({"error": "No notes provided"}), 400

    # Call the model logic
    question = generate_quiz_question(notes)
    
    return jsonify({
        "status": "success",
        "question": question
    })

if __name__ == '__main__':
    # This will load the model (in ai_core.py) and then start the server
    # Running in debug mode for development
    app.run(host='0.0.0.0', port=5000, debug=True)