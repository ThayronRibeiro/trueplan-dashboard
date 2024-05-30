import { Chamado } from "@/app/models/chamado";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Chamado>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="ml-[6px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status.descricao",
    header: () => <div className="w-[90px]">Status</div>,
    cell: ({ row }) => {
      return (
        <div
          className="font-medium hover:opacity-90 items-center justify-center flex h-[55px]"
          style={{
            backgroundColor: `${row.original.status.corBackground}`,
            color: `${row.original.status.corLetras}`,
          }}
        >
          {row.original.status.descricao}
        </div>
      );
    },
  },
  {
    accessorKey: "prioridade",
    header: () => (
      <div className="w-[80px] items-center justify-center flex">
        Prioridade
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="justify-center flex">{row.original.prioridade}</div>
      );
    },
  },
  {
    accessorKey: "usuario.nome",
    header: () => (
      <div className="w-[80px] items-center justify-center flex">Atendente</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="justify-center flex">{row.original.usuario.nome}</div>
      );
    },
  },
  {
    id: "cliente",
    accessorKey: "cliente.nomeFantasia",
    // header: () => <div className="w-[220px]">Cliente</div>,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "contato",
    header: () => <div className="w-[120px]">Contato</div>,
  },
  {
    accessorKey: "telefone1",
    header: () => <div className="w-[125px]">Telefone</div>,
  },
  {
    accessorKey: "descricaoProblema",
    header: () => <div className="w-[300px]">Descrição do problema</div>,
  },
  {
    accessorKey: "observacao",
    header: "Observação",
  },
  //Normalizador de pesquisa
  {
    id: "normalizador",
    header: () => <div className="hidden"></div>,
    cell: () => <div className="hidden"></div>,
    accessorFn: (row) =>
      `${row.id} ${row.cliente.nomeFantasia} ${row.descricaoProblema} ${row.contato}`,
  },
];
