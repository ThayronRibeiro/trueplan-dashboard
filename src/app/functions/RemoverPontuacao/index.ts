export function removerPontuacao(str: string) {
  // Usando expressão regular para substituir '.' e '/' por uma string vazia ''
  return str.replace(/[./-]/g, "");
}
