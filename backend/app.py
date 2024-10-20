from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from nltk.corpus import words
from collections import defaultdict

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def process_words():
    all_words = words.words()

    valid_words = defaultdict(list)
    
    for word in all_words:
        if not word.isalpha():
            continue
        word = word.upper()
        if len(set(word)) == 7:
            key = ''.join(sorted(set(word)))
            valid_words[key].append(word)
    
    return valid_words

valid_words = process_words()

@app.route('/api/letters', methods=['GET'])
def get_letters():
    letters = random.choice(list(valid_words.keys()))
    num_valid = len(valid_words[letters])
    return jsonify({
        'letters': list(letters),
        'num_valid_words': num_valid,
        'valid_words': valid_words[letters]
    })

@app.route('/api/validate', methods=['POST'])
def validate_word():
    word = request.json['word'].upper()
    letters = ''.join(sorted(request.json['letters']))

    print(word, letters)
    print(valid_words[letters])
    print(word in valid_words[letters])
    
    if word in valid_words[letters]:
        return jsonify({"valid": True})
    else:
        return jsonify({"valid": False})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)