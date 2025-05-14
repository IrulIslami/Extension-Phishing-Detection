from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Aktifkan CORS untuk ekstensi Chrome

# Muat model dan vectorizer phishing email
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # Gunakan get_json() bukan request.json
        if not data or 'email_text' not in data:
            return jsonify({'error': 'Invalid input format'}), 400

        email_text = data['email_text']
        
        # Debug: Print input received
        print(f"Received text: {email_text[:100]}...") 
        
        # Pastikan model dan vectorizer loaded
        if not hasattr(app, 'model'):
            app.model = pickle.load(open('model.pkl', 'rb'))
            app.vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
            
        # Transform dan prediksi
        features = app.vectorizer.transform([email_text])
        prediction = app.model.predict(features)[0]
        probability = app.model.predict_proba(features)[0].max()
        
        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability),
            'status': 'success'
        })
        
    except Exception as e:
        # Print full error traceback
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)