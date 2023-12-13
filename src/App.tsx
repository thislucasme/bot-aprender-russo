import "./css.css";
import axios from "axios";

// @ts-ignore
import { useSpeechSynthesis } from "react-speech-kit";
import {
  ChakraProvider,
  Box,
  Text,
  Input,
  Button,
  VStack,
  Grid,
  theme,
  HStack,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import botAvatar from "./robo.png"; // Replace with the actual path to your bot's avatar image
import { useEffect, useRef, useState } from "react";
import AudioRecorder from "./componentes/AudioRecorder";

enum TipoMsg {
  Normal = 0,
  SuccessoTraducao = 1,
  ErroTraducao = 2,
}
interface QnA {
  question: string;
  answer: string;
  translation: string;
  translationAnswer: string;
}

interface Message {
  text: string;
  sender: string;
  tipo: number;
}

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTraduzir, setIsTraduzir] = useState<boolean>(false);
  const [traducaoResposta, setTraducaoResposta] = useState("");
  const [lastBotMessage, setLastBotMessage] = useState<string | undefined>("");
  const OPENAI_API_KEY = "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";

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const { speak, speaking, supported } = useSpeechSynthesis();

  const textToSpeak = "hello how are u?"; // Texto en ruso

  const toast = useToast();
  const [qnaData, setQnaData] = useState<QnA[]>([
    {
      question: "oi",
      answer: "Olá! Como posso ajudar?",
      translation: "bulu",
      translationAnswer: "jub",
    },
    // Add more question-answer pairs as needed
  ]);



  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      //setLastUltilmaMensagem("jyug");

      setMessages([
        ...messages,
        { text: newMessage, sender: "user", tipo: TipoMsg.Normal },
      ]);
      

      // Call sendBot after a delay to simulate a bot response
      sendBot(newMessage)
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);

          // Assuming jsonData is an array of QnA objects
          setQnaData(jsonData);

          // Show a success toast
          toast({
            title: "Dados de estudo carregados com sucesso!",
            status: "success",
            duration: 5000, // Duração em milissegundos
            isClosable: true,
          });

          // Optionally, you can add a bot response after updating qnaData
          sendBot("upload")
        } catch (error) {
          console.error("Error parsing JSON file:", error);

          // Show an error toast
          toast({
            title: "Erro ao carregar dados de estudo.",
            status: "error",
            duration: 5000, // Duração em milissegundos
            isClosable: true,
          });
        }
      };

      reader.readAsText(file);
    }
  };

  const handleSpeak = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: any[] = [];
  
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });
  
      mediaRecorder.addEventListener("stop", async () => {
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
            console.log()
            setNewMessage(data?.text)
            setMessages([
              ...messages,
              { text: data?.text, sender: "user", tipo: TipoMsg.Normal },
            ]);
            sendBot(data?.text)
            //handleSendMessage();
            
          } else {
            console.error("Error transcribing audio:", response.statusText);
          }
        } catch (error) {
          console.error("Error transcribing audio:", error);
        }
      });
  
      mediaRecorder.start();
  
      // Record for a few seconds (adjust as needed)
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }, 5000); // Record for 5 seconds (adjust as needed)
    } catch (error) {
      console.error("Error recording audio:", error);
    }
  };
  

  function textToSpeach(text:string){
    const requestData = {
      model: 'tts-1',
      input: text,
      voice: 'alloy'
    };
    fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.blob())
      .then(blob => {
        const audioUrl = URL.createObjectURL(blob);
        
        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();
      })
      .catch(error => console.error('Error:', error));
  }

  const sendBot = (input:string) => {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "você é um professor de Russo. sempre aja como um profesor, explique de forma não demorada, e sempre, sempre diga para o aluno repetir.",
          },
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 1,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setNewMessage("")
      console.log(data?.choices[0]?.message?.content);
      textToSpeach(data?.choices[0]?.message?.content)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data?.choices[0]?.message?.content,
          sender: "bot",
          tipo: TipoMsg.Normal,
        },
      ]);
    })
    .catch((error) => console.error("Error:", error));

      //  setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     text: "Corrigindo o código, parece que há um erro de sintaxe e falta de um ponto e vírgula. Aqui está a versão corrigida:",
      //     sender: "bot",
      //     tipo: TipoMsg.Normal,
      //   },
      // ]);
  };

  const findAnswer = (question: string): string | undefined => {
    const lowercaseQuestion = question.toLowerCase();
    const matchingQnA = qnaData.find(
      (qna) => qna.question.toLowerCase() === lowercaseQuestion
    );
    return matchingQnA?.answer;
  };
  const findTranslation = (
    matchingAnswer: string | undefined
  ): string | undefined => {
    const matchingQnA = qnaData.find((qna) => qna.answer === matchingAnswer);
    return matchingQnA?.translationAnswer;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the message container when messages are updated
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserResponse = (text: string) => {};

  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.100" textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack>
            <VStack
              px={5}
              py={3}
              w={"80%"}
              borderRadius={5}
              bg="white"
              spacing={8}
              align="stretch"
            >
              <HStack>
                <Avatar size="sm" src={botAvatar} name="Bot Avatar" />
                <Text color={"#232629"} fontSize="2xl">
                  Bot Conversação
                </Text>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label htmlFor="fileInput">
                  <Button as="span" colorScheme="teal" size="sm">
                    Upload Brain
                  </Button>
                </label>
              </HStack>
              <Box
                overflowY="auto" // Enable vertical scrolling
                maxH="400px" // Set a fixed height for the message container
                ref={messageContainerRef}
              >
                <VStack spacing={2} align="stretch">
                  {messages.map((message, index) =>
                    message.sender === "user" ? (
                      <VStack align={"end"} key={index}>
                        <HStack
                          textAlign={"start"}
                          maxW={500}
                          color={"black"}
                          bg={"#D3D6D6"}
                          padding={2}
                          borderRadius={10}
                        >
                          <Text fontSize={"md"}>{message.text}</Text>
                        </HStack>
                      </VStack>
                    ) : (
                      <VStack align={"start"} key={index}>
                        {message.sender === "bot" &&
                        message.tipo === TipoMsg.ErroTraducao ? (
                          <>
                            <VStack align={"start"}>
                              <Alert fontSize={"sm"} status="error">
                                <AlertIcon />
                                <Box>
                                  <AlertDescription>
                                    <HStack alignContent={"start"}>
                                      {message.text
                                        .split(" ")
                                        .map((word, wordIndex) => (
                                          <Tooltip
                                            placement="top"
                                            hasArrow
                                            label="Tradução aqui"
                                            bg="#4AD897"
                                          >
                                            <Text
                                              color={"black"}
                                              key={wordIndex}
                                              fontSize={"sm"}
                                              onClick={() => {}}
                                              _hover={{
                                                background: "#78F5BC",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {`${word} `}
                                            </Text>
                                          </Tooltip>
                                        ))}
                                    </HStack>
                                  </AlertDescription>
                                </Box>
                              </Alert>

                              {message.sender === "bot" &&
                                index === messages.length - 1 && (
                                  <></>
                                  // <HStack mt={2} spacing={2}>
                                  //   <Alert status="warning">
                                  //     <AlertIcon />
                                  //     Responda o significado antes de
                                  //     responder ao Bot.
                                  //   </Alert>

                                  // </HStack>
                                )}
                            </VStack>
                          </>
                        ) : (
                          <>
                            {message.tipo === TipoMsg.SuccessoTraducao ? (
                              <>
                                <VStack align={"start"}>
                                  <Alert fontSize={"sm"} status="success">
                                    <AlertIcon />
                                    <Box>
                                      <AlertDescription>
                                        <HStack alignContent={"start"}>
                                          {message.text
                                            .split(" ")
                                            .map((word, wordIndex) => (
                                              <Tooltip
                                                placement="top"
                                                hasArrow
                                                label="Tradução aqui"
                                                bg="#4AD897"
                                              >
                                                <Text
                                                  color={"black"}
                                                  key={wordIndex}
                                                  size={"sm"}
                                                  onClick={() => {}}
                                                  _hover={{
                                                    background: "#78F5BC",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {`${word} `}
                                                </Text>
                                              </Tooltip>
                                            ))}
                                        </HStack>
                                      </AlertDescription>
                                    </Box>
                                  </Alert>

                                  {message.sender === "bot" &&
                                    index === messages.length - 1 && (
                                      <></>
                                      // <HStack mt={2} spacing={2}>
                                      //   <Alert status="warning">
                                      //     <AlertIcon />
                                      //     Responda o significado antes de
                                      //     responder ao Bot.
                                      //   </Alert>

                                      // </HStack>
                                    )}
                                </VStack>
                              </>
                            ) : (
                              <>
                                <VStack align={"start"}>
                                  <HStack
                                    maxW={500}
                                    textAlign={"start"}
                                    color={"black"}
                                    bg={"#4AD897"}
                                    padding={2}
                                    borderRadius={10}
                                  >
                               <Text fontSize={"md"}>{message.text}</Text>
                                  </HStack>

                                  {message.sender === "bot" &&
                                    index === messages.length - 1 && (
                                      <HStack mt={2} spacing={2}>
                                        {/* <Alert fontSize={"sm"} status="warning">
                                          <AlertIcon />
                                          Responda o significado antes de
                                          responder ao Bot.
                                        </Alert> */}
                                        {/* <Button
                                colorScheme="green"
                                variant="ghost"
                                onClick={() => handleUserResponse("Bom")}
                              >
                                Fácil
                              </Button>
                              <Button
                                colorScheme="yellow"
                                variant="ghost"
                                onClick={() => handleUserResponse("Difícil")}
                              >
                                Bom
                              </Button>
                              <Button
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleUserResponse("Fácil")}
                              >
                                Difícil
                              </Button> */}
                                      </HStack>
                                    )}
                                </VStack>
                              </>
                            )}
                          </>
                        )}
                      </VStack>
                    )
                  )}
                </VStack>
              </Box>
              <Box>
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSpeak} disabled={!supported || speaking}>
                  Говори!
                </button>
                <AudioRecorder/>
              </Box>
            </VStack>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
