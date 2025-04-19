from flask import Flask, request, jsonify 
from flask_cors import CORS 
from functools import wraps
from firebase_config import initialize_firebase
from firebase_admin import auth 
import tensorflow as tf 
import numpy as np 
from PIL import Image 
import os

# Initialize Flask app and Firebase
app = Flask(__name__)
CORS(app)
initialize_firebase()

# ===================== Authentication Middleware =====================
def check_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return jsonify({"error": "Authorization header missing or invalid"}), 401

        try:
            token = auth_header.split(' ')[1]
            decoded_token = auth.verify_id_token(token)
            request.user_id = decoded_token['uid']
        except Exception as e:
            return jsonify({"error": "Invalid token", "details": str(e)}), 403

        return f(*args, **kwargs)
    return decorated_function

# ===================== Model Loading =====================
MODEL_DIR = "../model/"

try:
    # Load models without optimizer state
    inception_model = tf.keras.models.load_model(
        os.path.join(MODEL_DIR, "InceptionResNetV2.keras"),
        compile=False
    )
    mobilenet_model = tf.keras.models.load_model(
        os.path.join(MODEL_DIR, "MobileNetV2.keras"),
        compile=False
    )
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Critical error loading models: {str(e)}")
    exit(1)

# ===================== Image Preprocessing =====================
def preprocess_image(image_path):
    """Matches training preprocessing (256x256, normalize to [0,1])"""
    img = Image.open(image_path).convert('RGB').resize((256, 256))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

# ===================== API Endpoints =====================
@app.route('/predict', methods=['POST'])
@check_token
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        model_type = request.form.get('model_type', 'inception')

        temp_path = "temp_pred_image.jpg"
        file.save(temp_path)

        processed_img = preprocess_image(temp_path)
        model = inception_model if model_type == "inception" else mobilenet_model
        prediction = model.predict(processed_img)
        
        os.remove(temp_path)

        return jsonify({
            "prediction": int(np.argmax(prediction)),
            "confidence": float(np.max(prediction)),
            "model_used": model_type
        })

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "models_loaded": True,
        "input_shape": "256x256x3"
    })

# ===================== Start Server =====================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  