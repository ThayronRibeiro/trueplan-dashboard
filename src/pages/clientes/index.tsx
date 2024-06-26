import { ClienteTable } from "@/components/patterns/ClienteTable";
import { FormCliente } from "@/components/patterns/FormCliente";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const Clientes = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex w-full justify-between align-middle mt-2 mb-2">
          <div>
            <h1 className="font-bold ml-4 text-lg text-neutral-800">
              Clientes
            </h1>
          </div>
          <DialogTrigger className="mr-2" asChild>
            <Button className="bg-emerald-400 hover:bg-emerald-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </DialogTrigger>
        </div>
        <Separator></Separator>
        <DialogContent className="min-w-[80%] min-h-[70%]">
          <DialogHeader>
            <DialogTitle>Criar novo cliente</DialogTitle>
            <DialogDescription>
              Preencha os campos para adicionar um novo cliente
            </DialogDescription>
          </DialogHeader>
          <FormCliente openOrClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <ClienteTable />
    </div>
  );
};
