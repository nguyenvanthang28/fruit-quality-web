import firebase_admin  # type: ignore
from firebase_admin import credentials # type: ignore

def initialize_firebase():
    # Path to your service account key
    cred = credentials.Certificate("serviceAccountKey.json")
    
    # Initialize Firebase Admin SDK
    firebase_admin.initialize_app(cred)
    print("✅ Firebase initialized successfully!")