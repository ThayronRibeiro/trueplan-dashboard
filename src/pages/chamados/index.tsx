import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChamadoService } from "@/app/services/chamados.service";
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
import { PlusCircle, Save } from "lucide-react";
// import { Chamado } from "@/app/models/chamado";
import { ChamadoTable } from "@/components/patterns/ChamadoTable";
import { FormChamado } from "@/components/patterns/FormChamado";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Chamados = () => {
  const [open, setOpen] = useState(false);

  //const [chamados, setChamados] = useState<Chamado[]>([]);
  const [datasAberturas, setDatasAbertura] = useState<string[]>([]);
  const chamadoService = useChamadoService();

  const { data: datasChamados } = useQuery({
    queryKey: ["datasChamados"],
    queryFn: chamadoService.listarDatas,
    refetchInterval: 60000,
  });

  const { mutateAsync: handleClose } = useMutation({
    mutationKey: ["chamados"],
    mutationFn: async () => {
      setOpen(false);
      chamadoService.listarDatas().then((value) => {
        console.log("Dados retornados de listarDatas:", value);
        datasChamados;
      });
    },
  });

  useEffect(() => {
    //Adquirindo a lista de datas para preencher as tabs de organização dos chamados
    chamadoService.listarDatas().then((value) => {
      console.log("Dados retornados de listarDatas:", value);
      setDatasAbertura(value ?? []);
      datasAberturas.map((data) => {
        chamadoService.listarChamadosPorData(data).then((value) => {
          console.log("Dados retornados de listarChamadosPorData:", value);
          //setChamados(value ?? []);
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = (data: string) => {
    chamadoService.listarChamadosPorData(data).then((value) => {
      console.log("Dados retornados de listarChamadosPorData:", value);
      //setChamados(value ?? []);
    });
  };

  const handleCloseDialog = () => {
    setOpen(false);
    chamadoService.listarDatas().then((value) => {
      console.log("Dados retornados de listarDatas:", value);
      setDatasAbertura(value ?? []);
    });
    // datasAberturas.map((data: string) => {
    //   chamadoService.listarChamadosPorData(data).then((value) => {
    //     //setChamados(value ?? []);
    //   });
    // });
  };

  return (
    <div className="p-4 space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
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
            <FormChamado openOrClose={handleClose}>
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
            </FormChamado>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Tabs orientation="horizontal">
        <TabsList>
          <>
            {datasChamados?.map((_datas) => (
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

        {datasChamados?.map((_datas) => (
          <>
            <TabsContent value={_datas}>
              <ScrollArea className="h-[75vh] w-full rounded-md border">
                <ChamadoTable dataChamado={_datas} />
              </ScrollArea>
            </TabsContent>
          </>
        ))}
      </Tabs>
    </div>
  );
};
