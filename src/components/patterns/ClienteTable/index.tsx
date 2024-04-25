import { formatarCPFCNPJ } from "@/app/functions/FormatarCpfCnpj";
import { formatarTelefone } from "@/app/functions/FormatarTelefone";
import { useClienteService } from "@/app/services/clientes.service";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

export const ClienteTable = () => {
  const clienteService = useClienteService();

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => {
      return clienteService.listarTodosOsClientes();
    },
    refetchInterval: 60000,
  });

  return (
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
      <TableBody>
        {clientes?.map((cliente) => (
          <>
            <TableRow>
              <TableCell>{cliente.id}</TableCell>
              <TableCell>{cliente.nomeFantasia}</TableCell>
              <TableCell>{formatarCPFCNPJ(cliente.cnpj ?? "")}</TableCell>
              <TableCell>{formatarTelefone(cliente.telefone1 ?? "")}</TableCell>
              <TableCell>{formatarTelefone(cliente.telefone2 ?? "")}</TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};
