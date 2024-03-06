import React, { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const OPENAI_API_KEY = "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";


const YourComponent = () => {
  const recorderControls = useAudioRecorder();
  const [transcription, setTranscription] = useState("");

  const addAudioElement = (blob:any) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    // Chame a API de transcrição aqui, passando o blob de áudio
    transcreverAudio(blob);
  };

  const transcreverAudio = async (audioBlob:any) => {
    console.log(audioBlob)
        
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`, // Use variáveis de ambiente para armazenar chaves sensíveis
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTranscription(data.transcriptions[0].text);
      } else {
        console.error("Erro ao transcrever áudio:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao transcrever áudio:", error);
    }
  };

  useEffect(() => {
    // Aqui você pode fazer algo com a transcrição, se necessário
    console.log("Transcrição:", transcription);
  }, [transcription]);

  return (
    <div>
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        downloadFileExtension="wav"
        
        mediaRecorderOptions={{mimeType:"wav",}}
      />
      <button onClick={recorderControls.stopRecording}>Parar gravação</button>
    </div>
  );
};

export default YourComponent;
