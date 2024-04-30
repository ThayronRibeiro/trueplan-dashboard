export function formatarDataController(data: string): string {
  // Separar a data em ano, mês e dia
  const [ano, mes, dia] = data.split("-");

  // Criar a data no formato desejado
  const novaData = new Date(`${mes}/${dia}/${ano}`);

  // Extrair dia, mês e ano da nova data
  const novoDia = novaData.getDate();
  const novoMes = novaData.getMonth() + 1; // Adicionar 1 pois os meses começam do 0
  const novoAno = novaData.getFullYear();

  // Formatar dia, mês e ano para ter dois dígitos (com zero à esquerda, se necessário)
  const diaFormatado = novoDia < 10 ? "0" + novoDia : novoDia;
  const mesFormatado = novoMes < 10 ? "0" + novoMes : novoMes;

  // Retornar a data formatada
  return `${diaFormatado}-${mesFormatado}-${novoAno}`;
}
