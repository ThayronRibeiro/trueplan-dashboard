export function formatarTelefone(numero: string) {
  // Remove todos os caracteres não numéricos
  const digitsOnly = numero.replace(/\D/g, "");

  // Verifica se o número tem 10 dígitos (telefone fixo) ou 11 dígitos (celular)
  const isTelefoneFixo = digitsOnly.length === 10;
  const isCelular = digitsOnly.length === 11;

  // Formatação de acordo com o tipo (telefone fixo ou celular)
  if (isTelefoneFixo) {
    return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (isCelular) {
    return digitsOnly.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  } else {
    // Retorna a string original se não for telefone fixo nem celular
    return numero;
  }
}
