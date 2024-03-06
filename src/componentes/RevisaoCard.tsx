// src/components/RevisaoFrase.tsx
import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import FraseCard from "./FraseCard";

interface RevisaoFraseProps {
  frases: Array<{ texto: string; nota: number; repeticoes: number }>;
  onClassificar: (nota: number) => void;
}

const RevisaoFrase: React.FC<RevisaoFraseProps> = ({ frases, onClassificar }) => {
  return (
    <Box>
      <Heading mb={4}>Revisão de Frases</Heading>
      {frases.map((frase, index) => (
        <FraseCard key={frase.texto} frase={frase} onClassificar={onClassificar} />
      ))}
    </Box>
  );
};

export default RevisaoFrase;
