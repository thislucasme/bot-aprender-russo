import "./css.css";
import axios from 'axios';

// @ts-ignore
import { useSpeechSynthesis } from 'react-speech-kit';
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

  const { speak, speaking, supported } = useSpeechSynthesis();

  const textToSpeak = 'hello how are u?'; // Texto en ruso

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

  const handleSpeak = async () => {
    try {
      const response = await axios.post(
        'https://ttsmp3.com/makemp3_new.php',
        {
          msg: "Привет, как дела?",
          lang: 'Maxim',
          source: 'ttsmp3',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // Adicione outros headers necessários aqui
          },
        }
      );
  
      // Verifique se a resposta foi bem-sucedida
      if (response.status === 200) {
        const audioUrl = response.data.mp3;
        // Agora você tem a URL do áudio gerado, você pode usar isso conforme necessário
        // Por exemplo, você pode reproduzir o áudio usando a tag <audio>
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        // Lidar com erros, se necessário
        console.error('Erro ao obter resposta da API');
      }
    } catch (error) {
      // Lidar com erros de requisição
      console.error('Erro ao fazer requisição para a API', error);
    }
  };
  

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      //setLastUltilmaMensagem("jyug");

      setMessages([
        ...messages,
        { text: newMessage, sender: "user", tipo: TipoMsg.Normal },
      ]);
      setNewMessage("");

      // Call sendBot after a delay to simulate a bot response
      setTimeout(sendBot, 500);
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
          setTimeout(sendBot, 500);
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

  const sendBot = () => {
    if (!isTraduzir) {
      const matchingAnswer = findAnswer(newMessage);
      setLastBotMessage(matchingAnswer);
      if (newMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: matchingAnswer || "Desculpe, não entendi.",
            sender: "bot",
            tipo: TipoMsg.Normal,
          },
        ]);
      }
      if(newMessage){
        setIsTraduzir(true);
      }
    } else {
      console.log(lastBotMessage, isTraduzir);
      const translation = findTranslation(lastBotMessage);
      console.log(translation);
      if (newMessage === translation) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: newMessage,
            sender: "bot",
            tipo: TipoMsg.SuccessoTraducao,
          },
        ]);
        setIsTraduzir(false);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: newMessage,
            sender: "bot",
            tipo: TipoMsg.ErroTraducao,
          },
        ]);
      }
    }
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
              w={600}
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
                          color={"white"}
                          bg={"#D3D6D6"}
                          padding={2}
                          borderRadius={10}
                        >
                          {message.text.split(" ").map((word, wordIndex) => (
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
                                  <Alert fontSize={"sm"}  status="success">
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
                                    color={"white"}
                                    bg={"#D3D6D6"}
                                    padding={2}
                                    borderRadius={10}
                                  >
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

                                  {message.sender === "bot" &&
                                    index === messages.length - 1 && (
                                      <HStack mt={2} spacing={2}>
                                        <Alert  fontSize={"sm"} status="warning">
                                          <AlertIcon />
                                          Responda o significado antes de
                                          responder ao Bot.
                                        </Alert>
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
              </Box>
            </VStack>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
