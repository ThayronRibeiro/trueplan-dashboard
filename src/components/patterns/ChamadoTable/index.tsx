import { Chamado } from "@/app/models/chamado";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ChamadoTableProps {
  chamados: Chamado[];
}

export const ChamadoTable = ({ chamados }: ChamadoTableProps) => {
  const handleFinally = (chamado: Chamado) => {
    //Configurar um endpoint no Spring para receber o novo status e persstir no banco de dados
    chamado.status.id = "2";
  };

  const handleCancel = (chamado: Chamado) => {
    //Configurar um endpoint no Spring para receber o novo status e persstir no banco de dados
    console.log(`Cancelar o chamado ${chamado.id}`);
  };

  return (
    <div className="rounded-md border ">
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
            <TableHead className="w-[380px]">Descrição do problema</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chamados.map((chamado) => (
            <Dialog>
              <DialogTrigger asChild>
                <TableRow key={chamado.id}>
                  <TableCell
                    className="font-medium hover:opacity-90 items-center justify-center flex"
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
                  <TableCell>{chamado.descricaoProblema}</TableCell>
                </TableRow>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chamado #{chamado.id}</DialogTitle>
                  <DialogDescription>
                    Efetue alterações em seu chamado e/ou escreva comentários
                    sobre
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-full w-full rounded-md border p-4">
                  <div className="flex w-full justify-between">
                    {!chamado.tecnico && (
                      <div className="flex w-full h-8 p-2 cursor-pointer items-center justify-center gap-2 bg-slate-800 hover:opacity-85 rounded-md text-white">
                        <>
                          <Hand className="w-4 h-4" /> Pegar chamado
                        </>
                      </div>
                    )}
                    <div className="flex w-full items-center justify-end gap-3">
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
                    </div>
                  </div>
                  <Label>Cliente</Label>
                  <Input
                    className="pointer-events-none"
                    value={chamado.cliente.nomeFantasia}
                    autoFocus={false}
                    disabled
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
