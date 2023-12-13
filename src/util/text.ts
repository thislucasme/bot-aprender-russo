export function similarityPercentage(string1 : string, string2: string) {
    const str1 = removeCommas(string1).toLocaleLowerCase();
    const str2 = removeCommas(string2).toLocaleLowerCase();
    const len1 = str1.length + 1;
    const len2 = str2.length + 1;
  
    const matrix = Array.from({ length: len1 }, () => Array(len2).fill(0));
  
    for (let i = 0; i < len1; i++) {
      matrix[i][0] = i;
    }
  
    for (let j = 0; j < len2; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i < len1; i++) {
      for (let j = 1; j < len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  
    const distance = matrix[len1 - 1][len2 - 1];
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = (1 - distance / maxLength) * 100;
  
    return similarity.toFixed(2); // Retornar a porcentagem formatada com duas casas decimais
  }
export function removeCommas(inputString:string) {
    const cleaned =  inputString.replace(/[,\?.!;]/g, "");
    return cleaned.replace(/\s+/g, ' ').trim();
  }