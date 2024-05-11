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
import { Clock, Hand, Repeat, SquareCheckBig, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { MyTooltip } from "../Tooltip";
import { Loading } from "../Loading";
import { FormReagendamento } from "../FormReagendamento";
import { Row } from "@tanstack/react-table";

interface DialogEditChamadoProps {
  children: ReactNode;
  chamado: Row<Chamado>;
  cancelFunction: {
    isSuccess: boolean;
    isPending: boolean;
  };
  handleCancel: () => Promise<void>;
  handleReagendar: () => Promise<void>;
}

export const DialogEdit = ({
  children,
  chamado,
  handleCancel,
  handleReagendar,
  cancelFunction,
}: DialogEditChamadoProps) => {
  const [open, setOpen] = useState(false);
  const [openReagendamento, setOpenReagendamento] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chamado #{chamado.id}</DialogTitle>
            <DialogDescription>
              {chamado.original.cliente.nomeFantasia}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full w-full rounded-md border p-4">
            <div className="flex w-full justify-between">
              <div className="flex w-full items-center gap-3">
                {chamado.original.status.id && (
                  <>
                    {!chamado.original.tecnico &&
                      chamado.original.status.id != "3" && (
                        <div className="flex w-100 h-8 p-2 cursor-pointer items-center justify-center gap-2 bg-slate-800 hover:opacity-85 rounded-md text-white">
                          <>
                            <Hand className="w-4 h-4" /> Pegar chamado
                          </>
                        </div>
                      )}

                    <Dialog
                      open={openReagendamento}
                      onOpenChange={setOpenReagendamento}
                    >
                      <DialogTrigger asChild>
                        <div>
                          <MyTooltip text="Reagendar chamado">
                            <Clock className="bg-gray-400 p-1 rounded-sm cursor-pointer" />
                          </MyTooltip>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Reagendamento de chamado</DialogTitle>
                        <DialogDescription>
                          Selecione a data para o reagendamento do chamado
                        </DialogDescription>
                        <FormReagendamento
                          openOrClose={() => {
                            setOpenReagendamento(false);
                            setOpen(false);
                          }}
                          chamado={chamado.original}
                        />
                      </DialogContent>
                    </Dialog>

                    <MyTooltip text="Transferir chamado">
                      <Repeat className="bg-orange-400 p-1 rounded-sm cursor-pointer" />
                    </MyTooltip>
                    <MyTooltip text="Cancelar chamado">
                      <X
                        className="bg-red-500 p-1 rounded-sm cursor-pointer"
                        onClick={async () => {
                          await handleCancel();
                          if (cancelFunction.isPending) {
                            <Loading />;
                          }
                          if (cancelFunction.isSuccess) {
                            setOpen(false);
                          }
                        }}
                      />
                    </MyTooltip>
                    <MyTooltip text="Finalizar chamado">
                      <SquareCheckBig className="bg-green-400 p-1 rounded-sm cursor-pointer" />
                    </MyTooltip>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {/* <Loading />; */}
    </>
  );
};
