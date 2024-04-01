import { Chamado } from "@/app/models/chamado";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ChamadoTableProps {
  chamados: Chamado[];
}

export const ChamadoTable = ({ chamados }: ChamadoTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Todos os chamados desta data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]">Prioridade</TableHead>
            <TableHead className="w-[100px]">Atendente</TableHead>
            <TableHead className="ali">Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="w-[125px]">Telefone</TableHead>
            <TableHead>Descrição do problema</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chamados.map((chamado) => (
            <TableRow>
              <TableCell
                className={cn(
                  `font-medium bg-[#${chamado.status.corBackground}] text-[#${chamado.status.corLetras}]`
                )}
              >
                {chamado.status.descricao}
              </TableCell>
              <TableCell>{chamado.prioridade}</TableCell>
              <TableCell>{chamado.usuario.nome}</TableCell>
              <TableCell>{chamado.cliente.nomeFantasia}</TableCell>
              <TableCell>{chamado.contato}</TableCell>
              <TableCell>{chamado.telefone1}</TableCell>
              <TableCell>{chamado.descricaoProblema}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
