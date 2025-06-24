This project is a real-time Malayalam speech-to-text application using a fine-tuned Whisper-small model. Since Whisper-large-v3 showed low accuracy for Malayalam and local training wasn't possible due to lack of GPU, the Whisper-small model was fine-tuned using LoRA in Google Colab on 1000 Malayalam audio samples. The backend is built with Flask and runs in Colab (exposed via ngrok), while the frontend is a simple React app running locally.








