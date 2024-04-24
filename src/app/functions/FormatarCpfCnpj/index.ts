export function formatarCPFCNPJ(str: string) {
  // Remove caracteres não numéricos
  const digitsOnly = str.replace(/\D/g, "");

  // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
  const isCPF = digitsOnly.length === 11;
  const isCNPJ = digitsOnly.length === 14;

  // Formatação de acordo com o tipo (CPF ou CNPJ)
  if (isCPF) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (isCNPJ) {
    return digitsOnly.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  } else {
    // Retorna a string original se não for CPF nem CNPJ
    return str;
  }
}
