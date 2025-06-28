from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

def load_quiz_data(subject, lesson, page_range):
    """Load quiz data from JSON file"""
    filename = f"quiz_data/{subject}_{lesson}.json"
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            quiz_key = f"{subject}_{lesson}_{page_range.replace('-', '_')}"
            return data.get(quiz_key)
    except FileNotFoundError:
        print(f"Quiz file not found: {filename}")
        return None
    except json.JSONDecodeError:
        print(f"Invalid JSON in file: {filename}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/social')
def social():
    return render_template('social/social.html')

@app.route('/social/politics')
def social_politics():
    return render_template('social/socialPolitics.html')

@app.route('/social/politics/quiz/<page_range>')
def social_politics_quiz(page_range):
    quiz_data = load_quiz_data('social', 'politics', page_range)
    if not quiz_data:
        return render_template('under_construction.html')
    return render_template('social/quiz.html', quiz=quiz_data, subject='Social Politics', page_range=page_range)

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    subject = data.get('subject', 'social')
    lesson = data.get('lesson', 'politics')
    page_range = data.get('page_range', '1-5')
    user_answers = data.get('answers')
    
    quiz_data = load_quiz_data(subject, lesson, page_range)
    if not quiz_data:
        return jsonify({'error': 'Quiz not found'})
    
    score = 0
    results = []
    
    for question in quiz_data['questions']:
        user_answer = user_answers.get(str(question['id']))
        is_correct = user_answer == question['correct']
        if is_correct:
            score += 1
        
        results.append({
            'question': question['question'],
            'options': question['options'],
            'correct_answer': question['correct'],
            'user_answer': user_answer,
            'is_correct': is_correct
        })
    
    return jsonify({
        'score': score,
        'total': len(quiz_data['questions']),
        'results': results
    })

@app.route('/under_construction')
def under_construction():
    return render_template('under_construction.html')

# Routes for other subjects (all under construction for now)
@app.route('/mathematics')
def mathematics():
    return render_template('under_construction.html')

@app.route('/physics')
def physics():
    return render_template('under_construction.html')

@app.route('/chemistry')
def chemistry():
    return render_template('under_construction.html')

@app.route('/biology')
def biology():
    return render_template('under_construction.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

