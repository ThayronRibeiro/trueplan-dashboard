import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

import { Input } from "@/components/ui/input";
import { DialogEditChamado } from "../DialogEditChamado";
import { Chamado } from "@/app/models/chamado";
import { Bounce, toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChamadoService } from "@/app/services/chamados.service";

export function DataTable<TData extends Chamado, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const chamadoService = useChamadoService();

  const queryClient = useQueryClient();

  const notifyReagendadoSucces = () =>
    toast.success("Reagendado com sucesso!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });

  const dataChamadoAtivo = localStorage.getItem("dataChamadoAtivo");

  const {
    mutateAsync: handleCancel,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: async (variables: Chamado) => {
      const chamadoEncontrado = chamadoService.listarChamado(variables);

      if (chamadoEncontrado) {
        (await chamadoEncontrado).status.id = "3";
        chamadoService
          .atualizarChamado(await chamadoEncontrado)
          .then(() => {
            notifyCancelSucces();
            queryClient.prefetchQuery({
              queryKey: ["chamados"],
              queryFn: () => {
                return chamadoService.listarChamadosPorData(
                  dataChamadoAtivo ?? ""
                );
              },
            });
          })
          .catch(() => {
            notifyCancelError();
          });
      }
    },
  });

  const { mutateAsync: handleReagendar } = useMutation({
    mutationFn: async (variables: Chamado) => {
      const chamadoEncontrado = chamadoService.listarChamado(variables);

      if (chamadoEncontrado) {
        (await chamadoEncontrado).dataChamado = variables.dataChamado;
        localStorage.setItem(
          "dataChamadoAtivo",
          variables.dataChamado.replace("/", "-").replace("/", "-")
        );
        chamadoService.atualizarChamado(await chamadoEncontrado).then(() => {
          notifyReagendadoSucces();
          queryClient.fetchQuery({
            queryKey: ["chamados"],
            queryFn: () => {
              return chamadoService.listarChamadosPorData(
                localStorage.getItem("dataChamadoAtivo") ?? ""
              );
            },
          });
        });
      }
    },
  });

  const notifyCancelSucces = () =>
    toast.success("Cancelado com sucesso!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

  const notifyCancelError = () =>
    toast.error("O chamado não foi cancelado! Por favor, tente novamente", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

  return (
    <>
      <div className="flex items-center py-4 ml-5 mr-5">
        <Input
          placeholder="Procurar chamados..."
          value={
            (table.getColumn("normalizador")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("normalizador")?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded-md border m-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <DialogEditChamado
                  chamado={row.original}
                  handleCancel={() => handleCancel(row.original)}
                  handleReagendar={() => handleReagendar(row.original)}
                  cancelFunction={{
                    isSuccess: isSuccess,
                    isPending: isPending,
                  }}
                >
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </DialogEditChamado>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
