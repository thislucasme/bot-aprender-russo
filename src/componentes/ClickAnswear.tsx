import { Button, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { respostaAtom } from "../atom/appAtom";

export const ClickAnswear = () => {
  const [text, setText] = useRecoilState(respostaAtom);
  const [sugestao, setSugestao] = useState<string[]>([
  ]);
  const [resposta, setResposta] = useState<string[]>([]);

  const adicionarPalavraResposta = (palavra: string, index: number) => {
    setResposta([...resposta, palavra]);
    removerPalavraSugestao(index);
  };
  const removerPalavraSugestao = (index: number) => {
    if (index >= 0 && index < sugestao.length) {
      const novaSugestao = [...sugestao];
      novaSugestao.splice(index, 1);
      setSugestao(novaSugestao);
    }
  };

  const adicionarPalavraSugestao = (palavra: string, index: number) => {
    setSugestao([...sugestao, palavra]);
    removerPalavraResposta(index);
  };
  const removerPalavraResposta = (index: number) => {
    if (index >= 0 && index < resposta.length) {
      const novaResposta = [...resposta];
      novaResposta.splice(index, 1);
      setResposta(novaResposta);
    }
  };

  useEffect(() => {
   // setText("");
   //setSugestao([])
    // Transformar o texto em um array e adicionar ao estado sugestao
    const textoArray = text;
    setSugestao([...sugestao, ...textoArray]);

    // Limpar o estado de texto após a transformação
  
  }, [text]);

  return (
    <VStack>
      <HStack>
        {resposta.map((word, wordIndex) => (
          <Button
            key={wordIndex}
            colorScheme="whatsapp"
            onClick={() => adicionarPalavraSugestao(word, wordIndex)}
          >
            {word}
          </Button>
        ))}
      </HStack>
      <HStack>
        {sugestao.map((word, wordIndex) => (
          <Button
            key={wordIndex}
            colorScheme="gray"
            onClick={() => adicionarPalavraResposta(word, wordIndex)}
          >
            {word}
          </Button>
        ))}
      </HStack>
      <Button onClick={()=>{
        //setText("")
        setSugestao([])
        setResposta([])
      }} colorScheme="gray">Enviar</Button>
    </VStack>
  );
};
