import { useCategoriaService } from "@/app/services/categoria.service";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

export const CategoriaTable = () => {
  const categoriaService = useCategoriaService();

  const { data: categorias } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => {
      return categoriaService.listarTodasAsCategorias();
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
        {categorias?.map((categoria) => (
          <>
            <TableRow>
              <TableCell>{categoria.id}</TableCell>
              <TableCell>{categoria.descricao}</TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
};
