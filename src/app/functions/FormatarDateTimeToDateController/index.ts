export const formatarDateTimeToDateController = (dataHora: string): string => {
  // Divide a string da data e hora em partes
  const partes = dataHora.split(" ");

  // Pega apenas a parte da data (dd/MM/yyyy)
  const dataParte = partes[0];

  // Divide a parte da data em dia, mês e ano
  const [dia, mes, ano] = dataParte.split("/");

  // Formata a data no formato desejado (dd-MM-yyyy)
  const dataFormatada = `${dia}-${mes}-${ano}`;

  return dataFormatada;
};
