import { Button, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import Gif from "../img/microphone.gif";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const OPENAI_API_KEY = "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";

  const handleToggleRecording = async () => {
    if (isRecording) {
      // Se estiver gravando, pare a gravação
      if (mediaRecorder) {
        mediaRecorder.stop();
        setMediaRecorder(null);
        setIsRecording(false);
        setAudioChunks([]);
      }
    } else {
      // Se não estiver gravando, inicie a gravação
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          }
        });

        recorder.addEventListener("stop", async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const audioFile = new File([audioBlob], "recorded_audio.wav", {
              type: "audio/wav",
            });
      
            const formData = new FormData();
            formData.append("file", audioFile);
            formData.append("model", "whisper-1");
      
            try {
              const response = await fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                  },
                  body: formData,
                }
              );
      
              if (response.ok) {
                const data = await response.json();
                //const transcribedText = data.transcriptions[0].text;
      
                // Now you have the transcribed text, you can use it as needed
                console.log(data)
            
                //handleSendMessage();
                
              } else {
                console.error("Error transcribing audio:", response.statusText);
              }
            } catch (error) {
              console.error("Error transcribing audio:", error);
            }
          });

        recorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  return (
    <VStack>
      {!isRecording ? (
        <Button colorScheme="whatsapp" onClick={handleToggleRecording}>
          falar
        </Button>
      ) : (
        <>
          <VStack>
            <img
              onClick={handleToggleRecording}
              style={{ width: "40px", cursor: "pointer" }}
              src={Gif}
              alt="Microphone"
            />
            <Button colorScheme="red" onClick={handleToggleRecording}>
              Para
            </Button>
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default AudioRecorder;
