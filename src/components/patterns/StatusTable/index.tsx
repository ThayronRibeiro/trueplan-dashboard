import { useStatusChamadoService } from "@/app/services/status.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { FormStatus } from "../FormStatus";
import { useState } from "react";

export const StatusTable = () => {
  const [open, setOpen] = useState(false);
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
            <Dialog>
              <DialogTrigger asChild>
                <TableRow key={status.id}>
                  <TableCell>{status.id}</TableCell>
                  <TableCell>{status.descricao}</TableCell>
                </TableRow>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {status.id} - {status.descricao}
                  </DialogTitle>
                  <DialogDescription>
                    Efetue as alterações necessárias
                  </DialogDescription>
                </DialogHeader>
                <FormStatus
                  openOrClose={() => setOpen(false)}
                  statusChamado={status}
                />
              </DialogContent>
            </Dialog>
          </>
        ))}
      </TableBody>
    </Table>
  );
};
