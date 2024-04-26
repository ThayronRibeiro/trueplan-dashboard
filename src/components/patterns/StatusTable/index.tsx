import { useStatusChamadoService } from "@/app/services/status.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

import { DialogEditStatus } from "../DialogEditStatus";

export const StatusTable = () => {
  const statusChamadoService = useStatusChamadoService();

  const { data: status } = useQuery({
    queryKey: ["status_chamado"],
    queryFn: () => {
      return statusChamadoService.listarTodosStatus();
    },
    refetchInterval: 60000,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {status?.map((status) => (
          <>
            <DialogEditStatus status={status}>
              <TableRow key={status.id}>
                <TableCell>{status.id}</TableCell>
                <TableCell>{status.descricao}</TableCell>
              </TableRow>
            </DialogEditStatus>
          </>
        ))}
      </TableBody>
    </Table>
  );
};
