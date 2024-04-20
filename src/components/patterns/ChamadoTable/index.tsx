import { Chamado } from "@/app/models/chamado";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChamadoService } from "@/app/services/chamados.service";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MyTooltip } from "../Tooltip";
import { Clock, Hand, Repeat, SquareCheckBig, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChamadoTableProps {
  dataChamado: string;
}

export const ChamadoTable = ({ dataChamado }: ChamadoTableProps) => {
  const chamadoService = useChamadoService();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data: chamados, isLoading } = useQuery({
    queryKey: ["chamados"],
    queryFn: () => {
      return chamadoService.listarChamadosPorData(dataChamado);
    },
  });

  const { mutateAsync: handleCancel } = useMutation({
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
                return chamadoService.listarChamadosPorData(dataChamado);
              },
            });
          })
          .catch(() => {
            notifyCancelError();
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

  const handleFinally = (chamado: Chamado) => {
    //Configurar um endpoint no Spring para receber o novo status e persstir no banco de dados
    chamado.status.id = "2";
  };

  // const handleCancel = async (chamado: Chamado) => {
  //   const chamadoEncontrado = await chamadoService.listarChamado(chamado);

  //   console.log(chamadoEncontrado);

  //   if (chamadoEncontrado) {
  //     chamadoEncontrado.status.id = "3";
  //     chamadoService
  //       .atualizarChamado(chamadoEncontrado)
  //       .then((value) => {
  //         notifyCancelSucces();
  //         navigate("/");
  //         console.log(value);
  //       })
  //       .catch(() => {
  //         notifyCancelError();
  //       });
  //   }
  // };

  return (
    <>
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
          {isLoading && <p> Carregando... </p>}
          {chamados?.map((chamado) => (
            <Dialog>
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
              <DialogContent>
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
                          <MyTooltip text="Reagendar chamado">
                            <Clock className="bg-gray-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                          <MyTooltip text="Transferir chamado">
                            <Repeat className="bg-orange-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                          <MyTooltip text="Cancelar chamado">
                            <DialogClose asChild>
                              <X
                                className="bg-red-500 p-1 rounded-sm cursor-pointer"
                                onClick={() => {
                                  handleCancel(chamado);
                                  //setOpen(false);
                                }}
                              />
                            </DialogClose>
                          </MyTooltip>
                          <MyTooltip text="Finalizar chamado">
                            <SquareCheckBig
                              className="bg-green-400 p-1 rounded-sm cursor-pointer"
                              //   onClick={() => {
                              //     handleFinally(chamado);
                              //   }}
                            />
                          </MyTooltip>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
