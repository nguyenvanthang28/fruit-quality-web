import os
import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    """Initialize Firebase with your project-specific credentials"""
    
    # Configuration from your serviceAccountKey.json
    firebase_config = {
        "type": "service_account",
        "project_id": "fruit-quality-detection-d681e",
        "private_key_id": "1f48cd33957887ba8a624abb9ec35b11e6515967",
        "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),  # Read from environment
        "client_email": "firebase-adminsdk-fbsvc@fruit-quality-detection-d681e.iam.gserviceaccount.com",
        "client_id": "113571092783763894035",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fruit-quality-detection-d681e.iam.gserviceaccount.com"
    }

    # Initialize Firebase
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)
    print("✅ Firebase initialized successfully!")