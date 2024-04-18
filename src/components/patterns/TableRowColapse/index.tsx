import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MyTooltip } from "../Tooltip";
import { Clock, Hand, Repeat, SquareCheckBig, X } from "lucide-react";
import { ReactNode } from "react";
import { Chamado } from "@/app/models/chamado";

interface TableRowColapseProps {
  children?: ReactNode;
  chamado: Chamado;
}

export const TableRowColapse = ({ chamado }: TableRowColapseProps) => {
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <TableBody>
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
        </TableBody>
      </CollapsibleTrigger>
      <CollapsibleContent>
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
                      //   onClick={() => {
                      //     handleCancel(chamado);
                      //   }}
                    />
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
      </CollapsibleContent>
    </Collapsible>
  );
};
