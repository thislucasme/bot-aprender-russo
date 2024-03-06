// src/components/FraseCard.tsx
import { Box, Text, Button } from "@chakra-ui/react";
import React from "react";

interface FraseCardProps {
  frase: { texto: string; nota: number; repeticoes: number };
  onClassificar: (nota: number) => void;
}

const FraseCard: React.FC<FraseCardProps> = ({ frase, onClassificar }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
      <Text>{frase.texto}</Text>
      <Button mt={2} onClick={() => onClassificar(5)}>
        Fácil (5)
      </Button>
      <Button mt={2} onClick={() => onClassificar(4)}>
        Bom (4)
      </Button>
      <Button mt={2} onClick={() => onClassificar(1)}>
        Difícil (1)
      </Button>
    </Box>
  );
};

export default FraseCard;
