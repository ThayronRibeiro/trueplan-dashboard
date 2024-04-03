/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
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
import { ChamadoTable } from "./components/patterns/ChamadoTable";
import { DatasAbertura } from "./app/models/utils/DatasAberturas";
import { FormChamado, FormSchema } from "./components/patterns/FormChamado";
import { zodResolver } from "@hookform/resolvers/zod";

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
    chamadoService.listarChamadosPorData(data).then((value) => {
      console.log("Dados retornados de listarChamadosPorData:", value);
      setChamados(value ?? []);
    });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

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
        <div id="container" className="flex items-center justify-end">
          <DialogTrigger asChild>
            <Button className="flex items-center align-middle bg-emerald-500 hover:bg-emerald-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Chamado
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="min-w-[80%] min-h-[70%]">
          <DialogHeader>
            <DialogTitle>Criar novo chamado</DialogTitle>
            <DialogDescription>
              Preencha os campos obrigatórios para criar um novo chamado.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <FormChamado />
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
        <TabsList>
          <>
            {datasAberturas.map((_datas) => (
              <>
                <TabsTrigger
                  key={_datas}
                  className="transition-all duration-300"
                  value={_datas}
                  onClick={() => handleChangeTab(_datas)}
                >
                  {_datas.replace("-", "/").replace("-", "/")}
                </TabsTrigger>
              </>
            ))}
          </>
        </TabsList>

        {datasAberturas.map((_datas) => (
          <>
            <TabsContent value={_datas}>
              <ChamadoTable chamados={chamados} />
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
