from flask import Flask, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

# Retrieve Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/api/getMenuSuggestions', methods=['POST'])
def get_menu_suggestions():
    if not GEMINI_API_KEY:
        return jsonify({"error": "API key not configured"}), 500

    data = request.get_json()
    if not data or 'currentIntake' not in data or 'targetIntake' not in data:
        return jsonify({"error": "Missing data"}), 400

    current_intake = data['currentIntake']
    target_intake = data['targetIntake']

    # Construct the prompt for Gemini API
    prompt = f"""
Current intake:
Calories: {current_intake.get('calories', 0)}
Protein: {current_intake.get('protein', 0)}g
Fat: {current_intake.get('fat', 0)}g
Carbohydrates: {current_intake.get('carbohydrates', 0)}g

Target intake:
Calories: {target_intake.get('calories', 0)}
Protein: {target_intake.get('protein', 0)}g
Fat: {target_intake.get('fat', 0)}g
Carbohydrates: {target_intake.get('carbohydrates', 0)}g

Based on the current and target intake values, please provide 2-3 specific meal or food suggestions to help meet the targets.
Please provide the response as a list of suggestions, for example:
1. Grilled Chicken Salad
2. Lentil Soup
"""

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        if response.text:
            suggestions_text = response.text
            # Split by newline
            raw_suggestions = suggestions_text.splitlines()
            parsed_suggestions = []
            for line in raw_suggestions:
                # Remove common list prefixes (e.g., "1. ", "- ", "* ")
                cleaned_line = line.lstrip('0123456789.-* ')
                # Add to list if not empty after cleaning
                if cleaned_line:
                    parsed_suggestions.append(cleaned_line)

            if parsed_suggestions:
                return jsonify({"suggestions": parsed_suggestions})
            else:
                # Fallback if parsing results in an empty list but there was text
                return jsonify({"suggestions": ["Could not parse suggestions from AI.", suggestions_text]})
        else:
            return jsonify({"error": "Empty response from Gemini API"}), 500
    except Exception as e:
        return jsonify({"error": f"Error calling Gemini API: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000)
