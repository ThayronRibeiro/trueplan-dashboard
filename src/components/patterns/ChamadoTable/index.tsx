import { useChamadoService } from "@/app/services/chamados.service";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ChamadoTableProps {
  dataChamado: string;
}

export const ChamadoTable = ({ dataChamado }: ChamadoTableProps) => {
  const chamadoService = useChamadoService();

  const { data: chamados } = useQuery({
    queryKey: ["chamados"],
    queryFn: () => {
      return chamadoService.listarChamadosPorData(dataChamado);
    },
  });

  return (
    <>
      {/* <Table>
        <TableCaption>Todos os chamados desta data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]">Prioridade</TableHead>
            <TableHead className="w-[100px]">Atendente</TableHead>
            <TableHead className="w-[220px]">Cliente</TableHead>
            <TableHead className="w-[120px]">Contato</TableHead>
            <TableHead className="w-[125px]">Telefone</TableHead>
            <TableHead className="w-[300px]">Descrição do problema</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <p> Carregando... </p>}
          {chamados?.map((chamado) => (
            <DialogEditChamado
              chamado={chamado}
              handleCancel={() => handleCancel(chamado)}
              handleReagendar={() => handleReagendar(chamado)}
              cancelFunction={{ isSuccess: isSuccess, isPending: isPending }}
            >
              <TableRow key={chamado.id}>
                <TableCell
                  className="font-medium hover:opacity-90 items-center justify-center flex h-[55px]"
                  style={{
                    backgroundColor: `${chamado.status.corBackground}`,
                    color: `${chamado.status.corLetras}`,
                  }}
                >
                  {chamado.status.descricao}
                </TableCell>
                <TableCell>{chamado.prioridade}</TableCell>
                <TableCell>{chamado.usuario.nome}</TableCell>
                <TableCell>{chamado.cliente.nomeFantasia}</TableCell>
                <TableCell>{chamado.contato}</TableCell>
                <TableCell>{chamado.telefone1}</TableCell>
                <TableCell className="whitespace-normal break-all">
                  {chamado.descricaoProblema.length >= 45 ? (
                    <>{chamado.descricaoProblema.substring(0, 62)}...</>
                  ) : (
                    <>{chamado.descricaoProblema}</>
                  )}
                </TableCell>
                <TableCell>{chamado.observacao}</TableCell>
              </TableRow>
            </DialogEditChamado>
          ))}
        </TableBody>
      </Table> */}
      <DataTable columns={columns} data={chamados ?? []} />
    </>
  );
};
