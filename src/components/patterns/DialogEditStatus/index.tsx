import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { FormStatus } from "../FormStatus";

interface DialogEditStatusProps {
  children: ReactNode;
  status: StatusChamado;
}

export const DialogEditStatus = ({
  status,
  children,
}: DialogEditStatusProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {status.id} - {status.descricao}
          </DialogTitle>
          <DialogDescription>
            Efetue as alterações necessárias
          </DialogDescription>
        </DialogHeader>
        <FormStatus openOrClose={() => setOpen(false)} statusChamado={status} />
      </DialogContent>
    </Dialog>
  );
};
