import { Chamado } from "@/app/models/chamado";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Hand, Repeat, SquareCheckBig, X } from "lucide-react";
import { MyTooltip } from "../Tooltip";
import { useChamadoService } from "@/app/services/chamados.service";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChamadoTableProps {
  chamados: Chamado[];
}

export const ChamadoTable = ({ chamados }: ChamadoTableProps) => {
  const chamadoService = useChamadoService();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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

  const handleFinally = (chamado: Chamado) => {
    //Configurar um endpoint no Spring para receber o novo status e persstir no banco de dados
    chamado.status.id = "2";
  };

  const handleCancel = async (chamado: Chamado) => {
    const chamadoEncontrado = await chamadoService.listarChamado(chamado);

    console.log(chamadoEncontrado);

    if (chamadoEncontrado) {
      chamadoEncontrado.status.id = "3";
      chamadoService
        .atualizarChamado(chamadoEncontrado)
        .then((value) => {
          notifyCancelSucces();
          navigate("/");
          console.log(value);
        })
        .catch(() => {
          notifyCancelError();
        });
    }
  };

  return (
    <div className="rounded-md border ">
      <ToastContainer />
      <Table>
        <TableCaption>Todos os chamados desta data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]">Prioridade</TableHead>
            <TableHead className="w-[100px]">Atendente</TableHead>
            <TableHead className="w-[220px]">Cliente</TableHead>
            <TableHead className="w-[120px]">Contato</TableHead>
            <TableHead className="w-[125px]">Telefone</TableHead>
            <TableHead className="w-[300px]">Descrição do problema</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chamados.map((chamado) => (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <TableRow key={chamado.id}>
                  <TableCell
                    className="font-medium hover:opacity-90 items-center justify-center flex h-[55px]"
                    style={{
                      backgroundColor: `#${chamado.status.corBackground}`,
                      color: `#${chamado.status.corLetras}`,
                    }}
                  >
                    {chamado.status.descricao}
                  </TableCell>
                  <TableCell>{chamado.prioridade}</TableCell>
                  <TableCell>{chamado.usuario.nome}</TableCell>
                  <TableCell>{chamado.cliente.nomeFantasia}</TableCell>
                  <TableCell>{chamado.contato}</TableCell>
                  <TableCell>{chamado.telefone1}</TableCell>
                  <TableCell className="whitespace-normal break-all">
                    {chamado.descricaoProblema.length >= 45 ? (
                      <>{chamado.descricaoProblema.substring(0, 62)}...</>
                    ) : (
                      <>{chamado.descricaoProblema}</>
                    )}
                  </TableCell>
                </TableRow>
              </DialogTrigger>
              <DialogContent className="min-w-[50%] min-h-[70%]">
                <DialogHeader>
                  <DialogTitle>Chamado #{chamado.id}</DialogTitle>
                  <DialogDescription className="text-lg">
                    {chamado.cliente.nomeFantasia}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-full w-full rounded-md border p-4">
                  <div className="flex w-full justify-between">
                    <div className="flex w-full items-center justify-end gap-3">
                      {chamado.status.id && (
                        <>
                          {!chamado.tecnico && (
                            <div className="flex w-full h-8 p-2 cursor-pointer items-center justify-center gap-2 bg-slate-800 hover:opacity-85 rounded-md text-white">
                              <>
                                <Hand className="w-4 h-4" /> Pegar chamado
                                {chamado.status.id}
                              </>
                            </div>
                          )}
                          <MyTooltip text="Reagendar chamado">
                            <Clock className="bg-gray-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                          <MyTooltip text="Transferir chamado">
                            <Repeat className="bg-orange-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                          <MyTooltip text="Cancelar chamado">
                            <X
                              className="bg-red-500 p-1 rounded-sm cursor-pointer"
                              onClick={() => {
                                setOpen(false);
                                handleCancel(chamado);
                              }}
                            />
                          </MyTooltip>
                          <MyTooltip text="Finalizar chamado">
                            <SquareCheckBig
                              className="bg-green-400 p-1 rounded-sm cursor-pointer"
                              onClick={() => {
                                handleFinally(chamado);
                              }}
                            />
                          </MyTooltip>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3 mt-10">
                    <div className="col-span-2">
                      TEste
                      {/* <Popover
                        open={openPopoverCat}
                        onOpenChange={setOpenPopoverCat}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            role="combobox"
                            aria-expanded={openPopoverCat}
                            className="justify-between"
                          >
                            {value
                              ? categorias.find(
                                  (categoria) => categoria.id === value
                                )?.descricao
                              : "Select framework..."}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search framework..."
                              className="h-9"
                            />
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {categorias.map((categoria) => (
                                  <CommandItem
                                    key={categoria.descricao}
                                    value={categoria.id}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenPopoverCat(false);
                                    }}
                                  >
                                    {categoria.descricao}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        value === categoria.id
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
                      </Popover> */}
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
