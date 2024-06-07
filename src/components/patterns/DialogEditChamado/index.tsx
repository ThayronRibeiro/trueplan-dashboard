import { Chamado } from "@/app/models/chamado";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckIcon,
  Clock,
  Hand,
  Repeat,
  Save,
  SquareCheckBig,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { MyTooltip } from "../Tooltip";
import { Loading } from "../Loading";
import { FormReagendamento } from "../FormReagendamento";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useChamadoService } from "@/app/services/chamados.service";
import { cn } from "@/lib/utils";
import { Cliente } from "@/app/models/cliente";
import { Categoria } from "@/app/models/categoria";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/app/functions/FormatarData";
import { Bounce, toast } from "react-toastify";
import { ChamadoDTO } from "@/app/dto/chamadoDTO";

interface DialogEditChamadoProps {
  children: ReactNode;
  chamado: Chamado;
  cancelFunction: {
    isSuccess: boolean;
    isPending: boolean;
  };
  handleCancel: () => Promise<void>;
  handleReagendar: () => Promise<void>;
}

export const FormSchema = z.object({
  cliente_id: z.string({
    required_error: "Por favor selecione um cliente.",
  }),
  prioridade: z.enum(["URGENTE", "ALTA", "MEDIA", "BAIXA"], {
    required_error: "Por favor informe a prioridade.",
  }),
  contato: z.string({ required_error: "Por favor digite um contato." }).max(50),
  telefone1: z.string({
    required_error: "Por favor digite um telefone.",
  }),
  telefone2: z.optional(z.string()),
  categoria_id: z.string({
    required_error: "Por favor selecione uma categoria.",
  }),
  descricaoProblema: z.string({
    required_error: "Por favor informe a descrição do problema",
  }),
  observacao: z.optional(z.string()),
});

export const DialogEditChamado = ({
  children,
  chamado,
  handleCancel,
  cancelFunction,
}: DialogEditChamadoProps) => {
  const [open, setOpen] = useState(false);
  const [openReagendamento, setOpenReagendamento] = useState(false);

  const [changes, setChanges] = useState(false);

  const [openPopoverCli, setOpenPopoverCli] = useState(false);
  const [openPopoverCat, setOpenPopoverCat] = useState(false);

  const chamadoService = useChamadoService();

  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutateAsync: onSubmit }: any = useMutation({
    mutationKey: ["chamados"],
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const chamadoSave: ChamadoDTO = {
        id: chamado?.id?.toString(),
        descricaoProblema: data.descricaoProblema,
        clienteId: data.cliente_id,
        categoriaId: data.categoria_id,
        telefone1: data.telefone1,
        telefone2: data.telefone2,
        usuarioId: "1",
        statusChamadoId: "1",
        prioridade: data.prioridade.valueOf(),
        contato: data.contato,
        dataAbertura: "",
        observacao: data.observacao,
        dataChamado: chamado.dataChamado,
      };

      console.log(chamadoSave);

      chamadoService.atualizarChamado(chamadoSave).then((response) => {
        localStorage.setItem("dataChamadoAtivo", formatDate(new Date()));
        console.log(chamadoSave.dataAbertura);
        setOpen(false);
        notifySaveSucces();
        queryClient.prefetchQuery({
          queryKey: ["datasChamados"],
          queryFn: () => {
            return chamadoService.listarDatas();
          },
        });

        queryClient.setQueryData<Chamado[]>(["chamados"], (chamadosAntigos) => {
          return chamadosAntigos?.map((chamado) =>
            chamado.id === response.id ? response : chamado
          );
        });
        // queryClient.fetchQuery({
        //   queryKey: ["chamados"],
        //   queryFn: () => {
        //     return chamadoService.listarChamadosPorData(
        //       localStorage.getItem("dataChamadoAtivo") ?? ""
        //     );
        //   },
        // });
      });
    },
  });

  const notifySaveSucces = () =>
    toast.success("Cadastrado com sucesso!", {
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

  const clientes: Cliente[] | undefined = queryClient.getQueryData([
    "clientes",
  ]);

  const categorias: Categoria[] | undefined = queryClient.getQueryData([
    "categorias",
  ]);

  // const { data: clientes } = useQuery({
  //   queryKey: ["clientes"],
  //   queryFn: () => {
  //     return clienteService.listarTodosOsClientes();
  //   },
  //   staleTime: 300000,
  // });

  // const { data: categorias } = useQuery({
  //   queryKey: ["categorias"],
  //   queryFn: () => {
  //     return categoriaService.listarTodasAsCategorias();
  //   },
  //   staleTime: 300000,
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const defaultValues = {
    descricaoProblema: chamado.descricaoProblema.toUpperCase(),
    contato: chamado.contato.toUpperCase(),
    observacao: chamado.observacao,
    prioridade: chamado.prioridade,
    cliente_id: chamado.cliente.id.toString(),
    telefone1: chamado.telefone1,
    telefone2: chamado.telefone2,
    categoria_id: chamado.categoria?.id?.toString(),
  };

  useEffect(() => {
    form.setValue("cliente_id", defaultValues.cliente_id.toString());
    form.setValue("categoria_id", defaultValues.categoria_id?.toString() || "");
    form.setValue("prioridade", defaultValues.prioridade);
  }, []);

  const handleChanges = () => {
    setChanges(
      form.getValues("cliente_id").toString() !=
        defaultValues.cliente_id.toString() ||
        form.getValues("contato") != defaultValues.contato ||
        form.getValues("descricaoProblema") !=
          defaultValues.descricaoProblema ||
        form.getValues("observacao") != defaultValues.observacao ||
        form.getValues("categoria_id").toString() !=
          defaultValues.categoria_id?.toString() ||
        form.getValues("telefone1") != defaultValues.telefone1 ||
        form.getValues("telefone2") != defaultValues.telefone2 ||
        form.getValues("prioridade").toString() !=
          defaultValues.prioridade.toString()
        ? true
        : false
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-w-[80%] min-h-[70%]">
          <DialogHeader>
            <DialogTitle>Chamado #{chamado.id}</DialogTitle>
            <DialogDescription>
              {chamado.cliente.nomeFantasia}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <div className="flex w-full justify-between">
              <div className="flex w-full items-center gap-3">
                {chamado.status.id && (
                  <>
                    {!chamado.tecnico && chamado.status.id != "3" && (
                      <div className="flex w-100 h-8 p-2 cursor-pointer items-center justify-center gap-2 bg-slate-800 hover:opacity-85 rounded-md text-white">
                        <>
                          <Hand className="w-4 h-4" /> Pegar chamado
                        </>
                      </div>
                    )}

                    <Dialog
                      open={openReagendamento}
                      onOpenChange={setOpenReagendamento}
                    >
                      <DialogTrigger asChild>
                        <div>
                          <MyTooltip text="Reagendar chamado">
                            <Clock className="bg-gray-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Reagendamento de chamado</DialogTitle>
                        <DialogDescription>
                          Selecione a data para o reagendamento do chamado
                        </DialogDescription>
                        <FormReagendamento
                          openOrClose={() => {
                            setOpenReagendamento(false);
                            setOpen(false);
                          }}
                          chamado={chamado}
                        />
                      </DialogContent>
                    </Dialog>

                    <MyTooltip text="Transferir chamado">
                      <Repeat className="bg-orange-400 p-1 rounded-sm cursor-pointer" />
                    </MyTooltip>
                    <MyTooltip text="Cancelar chamado">
                      <X
                        className="bg-red-500 p-1 rounded-sm cursor-pointer"
                        onClick={async () => {
                          await handleCancel();
                          if (cancelFunction.isPending) {
                            <Loading />;
                          }
                          if (cancelFunction.isSuccess) {
                            setOpen(false);
                          }
                        }}
                      />
                    </MyTooltip>
                    <MyTooltip text="Finalizar chamado">
                      <SquareCheckBig className="bg-green-400 p-1 rounded-sm cursor-pointer" />
                    </MyTooltip>
                  </>
                )}
              </div>
            </div>
            <Separator className="m-2" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Cliente * </FormLabel>
                      <Popover
                        open={openPopoverCli}
                        onOpenChange={setOpenPopoverCli}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between opacity-80",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? clientes?.find(
                                    (cliente) =>
                                      cliente.id?.toString() === field.value
                                  )?.nomeFantasia
                                : "Selecione o cliente"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[30rem] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Selecione o cliente..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum cliente encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {clientes?.map((cliente) => (
                                  <CommandItem
                                    value={cliente.nomeFantasia}
                                    key={cliente.id}
                                    onClick={() => {
                                      form.setValue(
                                        "cliente_id",
                                        cliente.id?.toString() ?? ""
                                      );
                                      handleChanges();
                                    }}
                                    onSelect={() => {
                                      form.setValue(
                                        "cliente_id",
                                        cliente.id?.toString() ?? ""
                                      );
                                      handleChanges();
                                    }}
                                    onDoubleClick={() => {
                                      setOpenPopoverCli(false);
                                    }}
                                  >
                                    {`${cliente.id} - ${cliente.nomeFantasia}`}

                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        cliente.id?.toString() === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="prioridade"
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-col"
                          onChange={() => handleChanges()}
                        >
                          <FormLabel htmlFor="prioridade">
                            Prioridade *{" "}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Prioridade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="URGENTE">Urgente</SelectItem>
                              <SelectItem value="ALTA">Alta</SelectItem>
                              <SelectItem value="MEDIA">Média</SelectItem>
                              <SelectItem value="BAIXA">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      defaultValue={defaultValues.contato}
                      name="contato"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="contato">Contato * </FormLabel>
                          <Input
                            placeholder="Digite o nome do contato"
                            {...field}
                            onChange={(e) => {
                              form.setValue(
                                "contato",
                                e.target.value.toUpperCase()
                              );
                              handleChanges();
                            }}
                            autoComplete="false"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="telefone1"
                      defaultValue={defaultValues.telefone1}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="telefone1">Telefone * </FormLabel>
                          <Input
                            placeholder="Digite o telefone do contato"
                            {...field}
                            onChange={(e) => {
                              form.setValue("telefone1", e.target.value);
                              handleChanges();
                            }}
                            autoComplete="false"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="telefone2"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="telefone2">Telefone 2 </FormLabel>
                          <Input
                            placeholder="Digite o telefone do contato"
                            {...field}
                            onChange={(e) => {
                              form.setValue("telefone2", e.target.value);
                              handleChanges();
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="categoria_id"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="telefone2">
                            Categoria *{" "}
                          </FormLabel>
                          <Popover
                            open={openPopoverCat}
                            onOpenChange={setOpenPopoverCat}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between opacity-80",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? categorias?.find(
                                        (categoria) =>
                                          categoria.id?.toString() ===
                                          field.value
                                      )?.descricao
                                    : "Selecione a categoria"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[13rem] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Selecione a categoria..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    Nenhuma categoria encontrada.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categorias?.map((categoria) => (
                                      <CommandItem
                                        value={categoria.descricao}
                                        key={categoria.id}
                                        onClick={() => {
                                          form.setValue(
                                            "categoria_id",
                                            categoria.id?.toString() ?? ""
                                          );
                                          handleChanges();
                                        }}
                                        onSelect={() => {
                                          form.setValue(
                                            "categoria_id",
                                            categoria.id?.toString() ?? ""
                                          );
                                          handleChanges();
                                        }}
                                        onDoubleClick={() => {
                                          setOpenPopoverCat(false);
                                        }}
                                      >
                                        {`${categoria.id} - ${categoria.descricao}`}

                                        <CheckIcon
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            categoria.id?.toString() ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3">
                  <div className="flex-col space-y-2 col-span-4">
                    <FormField
                      control={form.control}
                      defaultValue={defaultValues.descricaoProblema}
                      name="descricaoProblema"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="descricaoProblema">
                            Descrição do problema *{" "}
                          </FormLabel>
                          <Textarea
                            className="max-h-[75px]"
                            placeholder="Digite a descrição do problema"
                            {...field}
                            onChange={(e) => {
                              form.setValue(
                                "descricaoProblema",
                                e.target.value.toUpperCase()
                              );
                              handleChanges();
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="observacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Observação (Opcional) </FormLabel>
                      <Textarea
                        defaultValue={defaultValues.observacao}
                        className="max-h-[75px]"
                        placeholder="Digite uma observação sobre o chamado"
                        {...field}
                        onChange={(e) => {
                          form.setValue(
                            "observacao",
                            e.target.value.toUpperCase()
                          );
                          handleChanges();
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant={"outline"}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={!changes ? true : false}
                    type="submit"
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {/* <Loading />; */}
    </>
  );
};
