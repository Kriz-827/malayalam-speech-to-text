# 🎙️ Malayalam Speech-to-Text using Fine-tuned Whisper-small

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-REST%20API-black?logo=flask)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-yellow?logo=huggingface)
![Google Colab](https://img.shields.io/badge/Trained%20on-Google%20Colab%20T4-orange?logo=googlecolab)

A real-time Malayalam Speech-to-Text (STT) application built by fine-tuning OpenAI's Whisper-small model on Malayalam audio data. This project addresses the challenge of low ASR accuracy for Malayalam — a low-resource language — by adapting a pre-trained multilingual model using transfer learning.

---

## 🧠 Problem Statement

Malayalam is significantly underrepresented in Whisper's training data compared to high-resource languages like English. This results in low transcription accuracy for Malayalam audio out of the box. This project fine-tunes Whisper-small on a curated Malayalam dataset to improve accuracy for real-world use.

---

## 🏗️ Architecture

```
Malayalam Audio Input
        ↓
   React Frontend (Local)
        ↓ HTTP POST /transcribe
   Flask REST API (Google Colab + ngrok)
        ↓
   Fine-tuned Whisper-small Model
        ↓
   Malayalam Transcription Output
```

---

## ✨ Features

- 🎙️ Real-time Malayalam speech transcription
- 🤖 Fine-tuned Whisper-small for improved Malayalam accuracy
- 🌐 REST API built with Flask, exposed via ngrok
- ⚛️ Simple React frontend for audio recording and display
- 🔊 Automatic audio resampling to 16kHz
- 🇮🇳 Forced Malayalam language decoding for consistent output

---

## 📊 Training Results

| Parameter | Value |
|---|---|
| Base Model | openai/whisper-small |
| Dataset Size | 1,099 Malayalam audio-transcript pairs |
| Training Epochs | 10 |
| Batch Size | 4 (with gradient accumulation × 2) |
| Learning Rate | 1e-5 |
| GPU | NVIDIA Tesla T4 (Google Colab) |
| Training Time | ~50 minutes |
| Initial Training Loss | 0.1555 |
| Final Training Loss | **0.0064** |
| Precision | FP16 (Mixed Precision) |

> Training loss reduced by **~96%** over 10 epochs — from 0.1555 to 0.0064

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| ASR Model | OpenAI Whisper-small (HuggingFace Transformers) |
| Fine-tuning | Seq2SeqTrainer (HuggingFace) |
| Backend API | Python, Flask, Flask-CORS |
| Tunneling | ngrok (pyngrok) |
| Audio Processing | torchaudio |
| Frontend | React.js |
| Training Environment | Google Colab (Tesla T4 GPU) |

---

## 📁 Project Structure

```
malayalam-speech-to-text/
│
├── malayalamstt.ipynb        # Fine-tuning + Flask API notebook (Google Colab)
├── frontend/                 # React frontend
│   ├── src/
│   │   └── App.js            # Audio recording and transcription UI
│   └── package.json
├── manifest1000.csv          # Dataset manifest (audio paths + transcripts)
└── README.md
```

---

## 🚀 How to Run

### Backend (Google Colab)

1. Open `malayalamstt.ipynb` in Google Colab
2. Mount your Google Drive
3. Upload your Malayalam audio dataset to Drive
4. Run all cells sequentially
5. Copy the ngrok public URL from the output

### Frontend (Local)

```bash
cd frontend
npm install
npm start
```

Update the API URL in `App.js` with your ngrok URL:
```javascript
const response = await fetch("https://your-ngrok-url.ngrok-free.app/transcribe", {
  method: "POST",
  body: formData,
});
```

---

## 🔬 Technical Details

### Why Whisper-small?
Whisper is a multilingual ASR model pre-trained by OpenAI. While it supports Malayalam, the language is underrepresented in training data (~10-50 hours vs thousands for English). Whisper-small was chosen as a balance between model capacity and training feasibility on free Colab GPU.

### What is Fine-tuning?
Fine-tuning is a transfer learning technique where a pre-trained model is further trained on domain-specific data. Instead of training from scratch, Whisper's existing speech understanding is adapted for Malayalam using 1,099 audio-transcript pairs.

### Why Force Language Decoding?
Whisper uses automatic language detection by default. For low-resource languages, it may misidentify the language. We force `language="ml"` in the decoder prompt to ensure consistent Malayalam transcription.

---

## 📈 Sample Output

**Input:** Malayalam audio (WAV, 16kHz)

**Output:**
```
ഒരു ഉത്പന്നം അല്ലെങ്കിൽ സേവനം തകരാറിലായാൽ, ഉപഭോക്താവ് ഫെഡറൽ കമ്മീഷനിൽ പറാദിപ്പെടാം.
```

---

## 🌟 Key Achievements

- 📉 Reduced training loss by **96%** (0.1555 → 0.0064) over 10 epochs
- 🗣️ Successfully transcribed real Malayalam speech with improved accuracy
- 🌐 Deployed as a live REST API accessible via ngrok
- 🏛️ Built during internship at **High Court of Kerala IT Directorate**

---

## 🔮 Future Improvements

- [ ] Expand dataset to 10,000+ samples for better generalization
- [ ] Evaluate using Word Error Rate (WER) metric
- [ ] Deploy on a permanent cloud server (AWS/GCP) instead of ngrok
- [ ] Add noise reduction preprocessing
- [ ] Experiment with Whisper-medium for higher accuracy
- [ ] Implement LoRA (PEFT) for more efficient fine-tuning

---

## 👨‍💻 Author

**Krishnendu U N**
B.Tech in Artificial Intelligence & Data Science
Jyothi Engineering College, Thrissur | APJ KTU

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/krishnendu-u-n-b68361298)
[![GitHub](https://img.shields.io/badge/GitHub-Kriz--827-black?logo=github)](https://github.com/Kriz-827)
[![Email](https://img.shields.io/badge/Email-un.krishna.827%40gmail.com-red?logo=gmail)](mailto:un.krishna.827@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).







