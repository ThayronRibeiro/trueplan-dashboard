import { formatarCPFCNPJ } from "@/app/functions/FormatarCpfCnpj";
import { formatarTelefone } from "@/app/functions/FormatarTelefone";
import { useClienteService } from "@/app/services/clientes.service";
import { FormCliente } from "@/components/patterns/FormCliente";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const Clientes = () => {
  const clienteService = useClienteService();
  const [open, setOpen] = useState(false);

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => {
      return clienteService.listarTodosOsClientes();
    },
    refetchInterval: 60000,
  });

  return (
    <div className="p-4">
      <h1 className="font-bold">Clientes</h1>
      <Separator></Separator>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex w-full justify-end mt-2">
          <DialogTrigger asChild>
            <Button className="bg-emerald-400 hover:bg-emerald-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="min-w-[80%] min-h-[70%]">
          <DialogHeader>
            <DialogTitle>Criar novo cliente</DialogTitle>
            <DialogDescription>
              Preencha os campos para adicionar um novo cliente
            </DialogDescription>
          </DialogHeader>
          <FormCliente openOrClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Telefone 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="transition-all duration-300">
          {clientes?.map((cliente) => (
            <>
              <TableRow>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nomeFantasia}</TableCell>
                <TableCell>{formatarCPFCNPJ(cliente.cnpj ?? "")}</TableCell>
                <TableCell>
                  {formatarTelefone(cliente.telefone1 ?? "")}
                </TableCell>
                <TableCell>
                  {formatarTelefone(cliente.telefone2 ?? "")}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
