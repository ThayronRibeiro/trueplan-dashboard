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
import { toast } from "@/components/ui/use-toast";
import React, { ElementType, ReactNode, useEffect, useState } from "react";
import { Cliente } from "@/app/models/cliente";
import { Categoria } from "@/app/models/categoria";
import { useClienteService } from "@/app/services/clientes.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCategoriaService } from "@/app/services/categoria.service";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { Chamado } from "@/app/models/chamado";
import { useChamadoService } from "@/app/services/chamados.service";

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
  children: any;
}

export const FormChamado = ({ children }: FormChamadoProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const clienteService = useClienteService();
  const categoriaService = useCategoriaService();
  const chamadoService = useChamadoService();

  useEffect(() => {
    //Adquirindo a lista de clientes para servir de fonte de dados no combobox de criação de novo chamado
    clienteService.listarTodosOsClientes().then((value) => {
      console.log("Dados retornados de listarTodosOsClientes:", value);
      setClientes(value ?? []);
    });
    //Adquirindo a lista de categorias para serem utilizadas como fonte de dados no combobox
    categoriaService.listarTodasAsCategorias().then((value) => {
      console.log("Dados retornados de listarTodasAsCategorias:", value);
      setCategorias(value ?? []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const chamadoSave: Chamado = {
      descricaoProblema: data.descricaoProblema,
      cliente: {
        id: data.cliente_id,
      },
      categoria: {
        id: data.categoria_id,
      },
      telefone1: data.telefone1,
      telefone2: data.telefone2,
      usuario: {
        id: "1",
        nome: "",
        email: "",
        status: "",
        dataCadastro: "",
        ultimoAcesso: "",
      },
      prioridade: data.prioridade.valueOf(),
      contato: data.contato,
      status: {
        id: "1",
        descricao: "",
        corBackground: "",
        corLetras: "",
      },
      dataAbertura: "",
      observacao: data.observacao,
    };

    chamadoService.salvarChamado(chamadoSave).then(() => {
      console.log("Teste");
    });

    console.log(chamadoSave);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cliente_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cliente * </FormLabel>
              <Popover>
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
                            (cliente) => cliente.id?.toString() === field.value
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
                  <Popover>
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
                      form.setValue("descricaoProblema", e.target.value);
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
                  form.setValue("observacao", e.target.value);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
};
