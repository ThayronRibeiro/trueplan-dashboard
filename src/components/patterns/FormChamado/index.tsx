import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Chamado } from "@/app/models/chamado";
import { useChamadoService } from "@/app/services/chamados.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/app/functions/FormatarData";
import { ChamadoDTO } from "@/app/dto/chamadoDTO";
import { Cliente } from "@/app/models/cliente";
import { Categoria } from "@/app/models/categoria";

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

interface FormChamadoProps {
  openOrClose: () => void;
  children: ReactNode;
}

export const FormChamado = ({ children, openOrClose }: FormChamadoProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutateAsync: onSubmit }: any = useMutation({
    mutationKey: ["chamado-post"],
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const chamadoSave: ChamadoDTO = {
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
        dataChamado: "",
      };

      console.log(chamadoSave);

      chamadoService.salvarChamado(chamadoSave).then((response) => {
        localStorage.setItem("dataChamadoAtivo", formatDate(new Date()));
        console.log(chamadoSave.dataAbertura);
        openOrClose();

        /*
        const datas =
          queryClient.getQueryData<string[]>(["datasChamados"]) || [];
*/
        queryClient.setQueryData<string[]>(
          ["datasChamados"],
          (datasAntigas) => [...(datasAntigas || []), chamadoSave.dataAbertura]
        );

        // const chamados =
        //   queryClient.getQueryData<Chamado[]>(["chamados"]) || [];

        queryClient.setQueryData<Chamado[]>(["chamados"], (chamadosAntigos) => [
          ...(chamadosAntigos || []),
          response,
        ]);

        // queryClient.prefetchQuery({
        //   queryKey: ["datasChamados"],
        //   queryFn: () => {
        //     return chamadoService.listarDatas();
        //   },
        // });
        // queryClient.fetchQuery({
        //   queryKey: ["chamados"],
        //   queryFn: () => {
        //     return chamadoService.listarChamadosPorData(
        //       chamadoSave.dataChamado
        //     );
        //   },
        // });
      });

      // chamadoService.salvarChamado(chamadoSave).then(() => {
      //   localStorage.setItem("dataChamadoAtivo", formatDate(new Date()));
      //   console.log(chamadoSave.dataAbertura);
      //   openOrClose();
      //   queryClient.prefetchQuery({
      //     queryKey: ["datasChamados"],
      //     queryFn: () => {
      //       return chamadoService.listarDatas();
      //     },
      //   });
      //   queryClient.fetchQuery({
      //     queryKey: ["chamados"],
      //     queryFn: () => {
      //       return chamadoService.listarChamadosPorData(
      //         localStorage.getItem("dataChamadoAtivo") ?? ""
      //       );
      //     },
      //   });
      // });
    },
  });

  const [openPopoverCli, setOpenPopoverCli] = useState(false);
  const [openPopoverCat, setOpenPopoverCat] = useState(false);

  const chamadoService = useChamadoService();

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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cliente_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cliente * </FormLabel>
                <Popover open={openPopoverCli} onOpenChange={setOpenPopoverCli}>
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
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
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
                              }}
                              onSelect={() => {
                                form.setValue(
                                  "cliente_id",
                                  cliente.id?.toString() ?? ""
                                );
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
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="prioridade">Prioridade * </FormLabel>
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
                name="contato"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="contato">Contato * </FormLabel>
                    <Input
                      placeholder="Digite o nome do contato"
                      {...field}
                      onChange={(e) => {
                        form.setValue("contato", e.target.value.toUpperCase());
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
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="telefone1">Telefone * </FormLabel>
                    <Input
                      placeholder="Digite o telefone do contato"
                      {...field}
                      onChange={(e) => {
                        form.setValue("telefone1", e.target.value);
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
                    <FormLabel htmlFor="telefone2">Categoria * </FormLabel>
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
                                    categoria.id?.toString() === field.value
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
                                  }}
                                  onSelect={() => {
                                    form.setValue(
                                      "categoria_id",
                                      categoria.id?.toString() ?? ""
                                    );
                                  }}
                                  onDoubleClick={() => {
                                    setOpenPopoverCat(false);
                                  }}
                                >
                                  {`${categoria.id} - ${categoria.descricao}`}

                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      categoria.id?.toString() === field.value
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
                  className="max-h-[75px]"
                  placeholder="Digite uma observação sobre o chamado"
                  {...field}
                  onChange={(e) => {
                    form.setValue("observacao", e.target.value.toUpperCase());
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {children}
        </form>
      </Form>
    </>
  );
};
