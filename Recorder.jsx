import React, { useState, useRef } from 'react';

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [editedText, setEditedText] = useState('');
  const [status, setStatus] = useState('Ready to record...');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setStatus('Recording...');
    setRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        sendAudioToBackend(blob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error:', error);
      setStatus('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    setRecording(false);
    setStatus('Processing...');
  };

  const sendAudioToBackend = (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    fetch('http://127.0.0.1:5000/transcribe', {

      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      if (data.transcription) {
        setTranscription(prev => (prev ? prev + "\n\n" : "") + data.transcription);
setEditedText(prev => (prev ? prev + "\n\n" : "") + data.transcription);
 
        setStatus('✅ Transcription complete!');
      } else {
        setStatus('❌ Error: ' + data.error);
      }
    })
    .catch(err => {
      console.error('Error:', err);
      setStatus('❌ Error during transcription.');
    });
  };
const handleEditChange = (e) => {
    setEditedText(e.target.value);
};
const saveEditedText = () => {
    fetch('http://127.0.0.1:5000/save_transcription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edited_text: editedText }),
    })
    .then(res => res.json())
    .then(data => {
      setStatus(data.message || 'Saved successfully!');
    })
    .catch(err => {
      console.error(err);
      setStatus('Failed to save transcription.');
    });
  };
const copyText = () => {
    navigator.clipboard.writeText(editedText);
    setStatus('Copied to clipboard!');
  };

 

  const clearText = () => {
    setTranscription('');
    setEditedText('');
    setStatus('Text cleared.');
  };

  const saveText = () => {
    const blob = new Blob([editedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'malayalam-transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Text saved as file!');
  };

  return (
    <>
      <div className="control-panel">
        <button onClick={startRecording} disabled={recording} className="btn record-btn">
          <i className="fas fa-microphone"></i> Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording} className="btn stop-btn">
          <i className="fas fa-stop"></i> Stop Recording
        </button>
        {audioUrl && (
          <button onClick={() => new Audio(audioUrl).play()} className="btn play-btn">
            <i className="fas fa-play"></i> Play Recording
          </button>
        )}
      </div>

       <div className="text-container">
        {/* Replace div with editable textarea */}
        <textarea
          rows={10}
          cols={60}
          value={editedText}
          onChange={handleEditChange}
          placeholder="Transcribed text will appear here..."
          style={{ fontSize: '16px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
        />
        <div className="action-buttons" style={{ marginTop: '10px' }}>
          <button onClick={copyText} className="btn action-btn"><i className="far fa-copy"></i> Copy Text</button>
          <button onClick={clearText} className="btn action-btn"><i className="far fa-trash-alt"></i> Clear Text</button>
          <button onClick={saveText} className="btn action-btn"><i className="far fa-save"></i> Save Text (Local)</button>
          <button onClick={saveEditedText} className="btn action-btn" style={{ marginLeft: '10px' }}>
            <i className="fas fa-upload"></i> Save Edited Text (Backend)
          </button>
        </div>
      </div>

      <div className="status">{status}</div>
    </>
  );
};

export default Recorder;
