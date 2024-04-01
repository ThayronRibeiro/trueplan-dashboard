/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useChamadoService } from "./app/services/chamados.service";
import { Input } from "./components/ui/input";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Check, ChevronsUpDown, PlusCircle, Save } from "lucide-react";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "./lib/utils";
import { Cliente } from "./app/models/cliente";
import { useClienteService } from "./app/services/clientes.service";
import { Categoria } from "./app/models/categoria";
import { useCategoriaService } from "./app/services/categoria.service";
import { FormSubmitHandler } from "react-hook-form";
import { Chamado } from "./app/models/chamado";

export function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState("");
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [datasAberturas, setDatasAbertura] = useState<string[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente | string>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const chamadoService = useChamadoService();
  const clienteService = useClienteService();
  const categoriaService = useCategoriaService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: Chamado) => {
    console.log(data);
  };

  useEffect(() => {
    //Adquirindo a lista de datas para preencher as tabs de organização dos chamados
    chamadoService.listarDatas().then((value) => {
      console.log("Dados retornados de listarDatas:", value);
      setDatasAbertura(value ?? []);
    });
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
  }, []);

  const handleChangeTab = (data: string) => {
    setInterval(() => {
      chamadoService.listarChamadosPorData(data).then((value) => {
        console.log("Dados retornados de listarChamadosPorData:", value);
        setChamados(value ?? []);
      });
    }, 10000);
  };

  // const handleSubmit = (data: Chamado) => {
  //   chamadoService
  //     .salvarChamado(data)
  //     .then((value) => {
  //       console.log(value);
  //     })
  //     .catch(() => {
  //       console.log("Houve falha!");
  //     });
  // };

  return (
    <div className="p-4 space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <div id="container" className="flex items-center justify-end">
            <Button className="flex items-center">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Chamado
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="min-w-[80%] min-h-[70%]">
          <DialogHeader>
            <DialogTitle>Criar novo chamado</DialogTitle>
            <DialogDescription>
              Preencha os campos obrigatórios para criar um novo chamado.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-6 gap-3">
                <div className="flex-col space-y-2 col-span-6">
                  <Label htmlFor="descricaoProblema">Cliente*</Label>
                  <Popover
                    open={open}
                    onOpenChange={setOpen}
                    {...register("usuario", { required: true })}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: any) => setCliente(e.target.value)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {value
                          ? clientes.find(
                              (clientes) => clientes.nomeFantasia === value
                            )?.nomeFantasia
                          : "Selecione o cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="h-full w-[500px] p-0">
                      <Command>
                        <CommandInput placeholder="Selecione o cliente..." />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum cliente encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {clientes.map((clientes) => (
                              <CommandItem
                                key={clientes.id}
                                value={clientes.nomeFantasia.trim()}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value
                                      ? ""
                                      : currentValue || ""
                                  );
                                  setCliente(value);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === clientes.nomeFantasia
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {clientes.nomeFantasia}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-col space-y-2 col-span-1">
                  <Label htmlFor="descricaoProblema">Prioridade*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENTE">Urgente</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                      <SelectItem value="MEDIA">Média</SelectItem>
                      <SelectItem value="BAIXA">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-col space-y-2 col-span-2">
                  <Label htmlFor="contato">Contato*</Label>
                  <Input id="contato" placeholder="Digite o nome do contato" />
                </div>
                <div className="flex-col space-y-2 col-span-1">
                  <Label htmlFor="telefone1">Telefone*</Label>
                  <Input
                    id="telefone1"
                    placeholder="Digite o telefone do contato"
                  />
                </div>
                <div className="flex-col space-y-2 col-span-1">
                  <Label htmlFor="telefone1">Telefone 2*</Label>
                  <Input
                    id="telefone2"
                    placeholder="Digite o segundo telefone do contato"
                  />
                </div>
                <div className="flex-col space-y-2 col-span-1">
                  <Label htmlFor="categoria">Categoria*</Label>
                  <Popover open={open2} onOpenChange={setOpen2}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open2}
                        className="w-full justify-between"
                      >
                        {value
                          ? categorias.find(
                              (categorias) => categorias.descricao === value2
                            )?.descricao
                          : "Selecione a categoria.."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="h-full w-min-full p-0">
                      <Command>
                        <CommandInput placeholder="Selecione a categoria..." />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum categoria encontrada.
                          </CommandEmpty>
                          <CommandGroup>
                            {categorias.map((categorias) => (
                              <CommandItem
                                key={categorias.id}
                                value={categorias.descricao.trim()}
                                onSelect={(currentValue) => {
                                  setValue2(
                                    currentValue === value2
                                      ? ""
                                      : currentValue || ""
                                  );
                                  setOpen2(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value2 === categorias.descricao
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {categorias.descricao}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                <div className="flex-col space-y-2 col-span-4">
                  <Label htmlFor="descricaoProblema">
                    Descrição do problema*
                  </Label>
                  <Textarea
                    className="max-h-[75px]"
                    id="descricaoProblema"
                    placeholder="Digite a descrição do problema"
                  />
                </div>
              </div>
              <div className="flex-col space-y-2">
                <Label htmlFor="observacao">Observacão (Opcional)</Label>
                <Textarea
                  className="max-h-[75px]"
                  id="observacao"
                  placeholder="Digite uma observação sobre chamado"
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex items-center bg-emerald-500 hover:bg-emerald-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs orientation="horizontal">
        <TabsList loop={false}>
          {datasAberturas.map((_datas) => (
            <>
              <TabsTrigger value={_datas} key={_datas}>
                {_datas}
              </TabsTrigger>
            </>
          ))}
        </TabsList>

        {datasAberturas.map((_datas) => (
          <>
            <TabsContent value={_datas} key={_datas}>
              {_datas}
            </TabsContent>
          </>
        ))}
        {/* 
          <TabsContent value="30032024">Dia 30/03/2024</TabsContent>
          <TabsContent value="29032024">Dia 29/03/2024</TabsContent>
          <TabsContent value="28032024">Dia 28/03/2024</TabsContent>
          <TabsContent value="27032024">Dia 27/03/2024</TabsContent>
          <TabsContent value="26032024">Dia 26/03/2024</TabsContent>
          <TabsContent value="25032024">Dia 25/03/2024</TabsContent>
        */}
      </Tabs>
    </div>
  );
}

export default App;
