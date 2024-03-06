// src/AppQuiz.tsx
import { ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import RevisaoFrase from "./componentes/RevisaoCard";

interface Frase {
  texto: string;
  nota: number;
  repeticoes: number;
}

const frasesIniciais: Frase[] = [
  { texto: "A persistência é o caminho do êxito.", nota: 0, repeticoes: 0 },
  { texto: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", nota: 0, repeticoes: 0 },
];

export const AppQuiz: React.FC = () => {
  const [frases, setFrases] = useState<Frase[]>(frasesIniciais);
  const [indiceFraseAtual, setIndiceFraseAtual] = useState<number>(0);

  const onClassificar = (nota: number) => {
    const frasesAtualizadas = [...frases];
    const fraseAtual = frasesAtualizadas[indiceFraseAtual];

    // Define o número máximo de repetições para frases classificadas como "Fácil"
    const maxRepeticoesFacil = 1;

    if (nota === 5 && fraseAtual.repeticoes < maxRepeticoesFacil) {
      // Se a frase for classificada como "Fácil" e já foi classificada como "Fácil" antes, passa para a próxima frase
      if (fraseAtual.nota === 5) {
        setIndiceFraseAtual((prevIndice) => (prevIndice + 1) % frasesAtualizadas.length);
      }
      // Incrementa o número de repetições
      fraseAtual.repeticoes++;
    } else {
      // Se não for "Fácil" ou já atingiu o limite de repetições, reinicia as repetições e passa para a próxima frase
      fraseAtual.repeticoes = 0;
      setIndiceFraseAtual((prevIndice) => (prevIndice + 1) % frasesAtualizadas.length);
    }

    // Atualiza a nota da frase
    fraseAtual.nota = nota;

    // Atualiza o estado com as frases modificadas
    setFrases(frasesAtualizadas);
  };

  return (
    <ChakraProvider>
      <RevisaoFrase frases={[frases[indiceFraseAtual]]} onClassificar={onClassificar} />
    </ChakraProvider>
  );
};

