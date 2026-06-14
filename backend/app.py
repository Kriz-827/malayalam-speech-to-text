from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import WhisperForConditionalGeneration, WhisperProcessor
import torch
import torchaudio
import tempfile
import os
import subprocess

app = Flask(__name__)
CORS(app)

# Load fine-tuned model
MODEL_PATH = "../finetuned_model_small"
print(f"Loading fine-tuned Whisper model from {MODEL_PATH} ...")
processor = WhisperProcessor.from_pretrained(MODEL_PATH)
model = WhisperForConditionalGeneration.from_pretrained(MODEL_PATH)
model.eval()

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded.'}), 400

    audio_file = request.files['audio']
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp:
        audio_file.save(temp.name)
        input_path = temp.name

    # Convert to .wav using ffmpeg
    wav_path = input_path.replace(".webm", ".wav")
    try:
        subprocess.run(
            ["ffmpeg", "-i", input_path, "-ar", "16000", "-ac", "1", "-y", wav_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        waveform, sr = torchaudio.load(wav_path)
        if sr != 16000:
            resampler = torchaudio.transforms.Resample(sr, 16000)
            waveform = resampler(waveform)

        input_features = processor.feature_extractor(waveform.squeeze(), sampling_rate=16000, return_tensors="pt").input_features
        predicted_ids = model.generate(input_features)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        return jsonify({'transcription': transcription})
    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        os.remove(input_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)

if __name__ == '__main__':
    app.run(debug=True)
