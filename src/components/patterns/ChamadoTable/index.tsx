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
import { Bounce, toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogEditChamado } from "../DialogEditChamado";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ChamadoTableProps {
  dataChamado: string;
}

export const ChamadoTable = ({ dataChamado }: ChamadoTableProps) => {
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

  //const [open, setOpen] = useState(false);

  const { data: chamados, isLoading } = useQuery({
    queryKey: ["chamados"],
    queryFn: () => {
      return chamadoService.listarChamadosPorData(dataChamado);
    },
  });

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

  return (
    <>
      {/* <Table>
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
            <DialogEditChamado
              chamado={chamado}
              handleCancel={() => handleCancel(chamado)}
              handleReagendar={() => handleReagendar(chamado)}
              cancelFunction={{ isSuccess: isSuccess, isPending: isPending }}
            >
              <TableRow key={chamado.id}>
                <TableCell
                  className="font-medium hover:opacity-90 items-center justify-center flex h-[55px]"
                  style={{
                    backgroundColor: `${chamado.status.corBackground}`,
                    color: `${chamado.status.corLetras}`,
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
                <TableCell>{chamado.observacao}</TableCell>
              </TableRow>
            </DialogEditChamado>
          ))}
        </TableBody>
      </Table> */}
      <DataTable columns={columns} data={chamados ?? []} />
    </>
  );
};
