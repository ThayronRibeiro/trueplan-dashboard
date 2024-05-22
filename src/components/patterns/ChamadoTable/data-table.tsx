import {
  ColumnDef,
  ColumnFiltersState,
  Row,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChamadoService } from "@/app/services/chamados.service";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { converterData } from "@/app/functions/ConverterData";
import { formatarDataController } from "@/app/functions/FormatarDataController";

export const FormSchema = z.object({
  dataChamado: z.string({
    required_error: "Por favor, selecione uma nova data.",
  }),
});

export function DataTable<TData extends Chamado, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  // const handleReagendar = (
  //   chamados: Row<TData>[],
  //   data: z.infer<typeof FormSchema>
  // ) => {
  //   chamados.map((chamado) => {
  //     chamado.original.dataChamado = converterData(data.dataChamado);
  //     return chamadoService.atualizarChamado(chamado.original);
  //   });
  // };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setReagendamento(data.dataChamado);
    localStorage.setItem("dataChamadoAtivo", data.dataChamado);
    handleReagendarChamados(table.getFilteredSelectedRowModel().rows);
  };

  const [dataReagendamento, setReagendamento] = useState("");
  const [open, setOpen] = useState(false);

  const notifySaveSucces = () =>
    toast.success("Reagendamento concluído com sucesso!", {
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

  const notifyError = (message: string) =>
    toast.error(message, {
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

  const { mutate: handleReagendarChamados } = useMutation({
    mutationFn: async (chamados: Row<TData>[]) => {
      let novoChamado: Chamado | null = null;
      let novosChamados: Chamado[] | [] = [];
      chamados.map((chamado) => {
        chamado.original.dataChamado = converterData(dataReagendamento);
        novoChamado = chamado.original;
        novosChamados = [...novosChamados, novoChamado];
      });
      console.log(JSON.stringify(novosChamados));
      return await chamadoService.reagendarChamados(novosChamados);
    },
    onSuccess: () => {
      queryClient.prefetchQuery({
        queryKey: ["datasChamados"],
        queryFn: async () => {
          return chamadoService.listarDatas();
        },
      });

      queryClient.fetchQuery({
        queryKey: ["chamados"],
        queryFn: async () => {
          return chamadoService.listarChamadosPorData(
            formatarDataController(dataReagendamento ?? "")
          );
        },
      });
      setOpen(false);
      notifySaveSucces();
    },
    onError: () => {
      notifyError("Não foi possível reagendar o(s) chamado(s) solicitados!");
    },
  });

  return (
    <>
      <div className="flex items-center py-4 ml-5 mr-5 gap-3">
        <Input
          placeholder="Procurar chamados por ID, atendente, cliente ou descrição do problema..."
          value={
            (table.getColumn("normalizador")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("normalizador")?.setFilterValue(event.target.value)
          }
          className="w-3/4"
        />
        <div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-400 flex align-middle gap-2">
                  <Clock className="w-4 h-4" />
                  Reagendar Selecionados
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reagendar chamados</DialogTitle>
                  <DialogDescription>
                    Selecione a data do reagendamento
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="dataChamado"
                          render={({ field }) => (
                            <>
                              <FormLabel htmlFor="descricao">
                                Nova Data *{" "}
                              </FormLabel>
                              <Input
                                placeholder="Digite a descrição da categoria"
                                {...field}
                                onChange={(e) => {
                                  form.setValue("dataChamado", e.target.value);
                                }}
                                type="date"
                              />
                              <FormMessage />
                            </>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="flex items-center bg-emerald-500 hover:bg-emerald-600"
                    >
                      <>
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        Reagendar
                      </>
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
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
                <>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <>
                        {cell.column.id === "select" ? (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ) : (
                          <DialogEditChamado
                            chamado={row.original}
                            handleCancel={() => handleCancel(row.original)}
                            handleReagendar={() =>
                              handleReagendar(row.original)
                            }
                            cancelFunction={{
                              isSuccess: isSuccess,
                              isPending: isPending,
                            }}
                          >
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          </DialogEditChamado>
                        )}
                      </>
                    ))}
                  </TableRow>
                </>
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
