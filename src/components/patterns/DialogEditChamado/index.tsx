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

interface DialogEditChamadoProps {
  children: ReactNode;
  chamado: Chamado;
  cancelFunction: {
    isSuccess: boolean;
    isPending: boolean;
  };
  handleCancel: () => Promise<void>;
  handleReagendar: () => Promise<void>;
}

export const DialogEditChamado = ({
  children,
  chamado,
  handleCancel,
  handleReagendar,
  cancelFunction,
}: DialogEditChamadoProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
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
                      <Clock
                        className="bg-gray-400 p-1 rounded-sm cursor-pointer"
                        onClick={() => {
                          handleReagendar();
                        }}
                      />
                    </MyTooltip>
                    <MyTooltip text="Transferir chamado">
                      <Repeat className="bg-orange-400 p-1 rounded-sm cursor-pointer" />
                    </MyTooltip>
                    <MyTooltip text="Cancelar chamado">
                      <X
                        className="bg-red-500 p-1 rounded-sm cursor-pointer"
                        onClick={async () => {
                          await handleCancel();
                          if (await cancelFunction.isPending) {
                            <Loading />;
                          }
                          if (await cancelFunction.isSuccess) {
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
