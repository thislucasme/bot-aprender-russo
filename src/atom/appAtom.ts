import { atom } from "recoil";

export const respostaAtom = atom({
    key: 'resposta',
    default: [] as string[],
  });