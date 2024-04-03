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
import { useEffect, useState } from "react";
import { Cliente } from "@/app/models/cliente";
// import { Categoria } from "@/app/models/categoria";
import { useClienteService } from "@/app/services/clientes.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { useCategoriaService } from "@/app/services/categoria.service";

export const FormSchema = z.object({
  cliente: z.string({
    required_error: "Por favor selecione um cliente.",
  }),
  prioridade: z.enum(["URGENTE", "ALTA", "MEDIA", "BAIXA"]),
  contato: z.string().max(50),
});

export const FormChamado = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  // const [categorias, setCategorias] = useState<Categoria[]>([]);

  const clienteService = useClienteService();
  // const categoriaService = useCategoriaService();

  useEffect(() => {
    //Adquirindo a lista de clientes para servir de fonte de dados no combobox de criação de novo chamado
    clienteService.listarTodosOsClientes().then((value) => {
      console.log("Dados retornados de listarTodosOsClientes:", value);
      setClientes(value ?? []);
    });
    //Adquirindo a lista de categorias para serem utilizadas como fonte de dados no combobox
    // categoriaService.listarTodasAsCategorias().then((value) => {
    //   console.log("Dados retornados de listarTodasAsCategorias:", value);
    //   setCategorias(value ?? []);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
          name="cliente"
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
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? clientes?.find(
                            (cliente) => cliente.id === field.value
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
                              form.setValue("cliente", cliente.id ?? "");
                            }}
                            onSelect={() => {
                              form.setValue("cliente", cliente.id ?? "");
                            }}
                          >
                            {`${cliente.id} - ${cliente.nomeFantasia}`}

                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                cliente.id === field.value
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
                  <Input placeholder="Digite o nome do contato" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
