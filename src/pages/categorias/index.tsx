import { CategoriaTable } from "@/components/patterns/CategoriaTable";
import { FormCategoria } from "@/components/patterns/FormCategoria";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const Categoria = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex w-full justify-between align-middle mt-2 mb-2">
          <div>
            <h1 className="font-bold ml-4 text-lg text-neutral-800">
              Categorias
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova categoria</DialogTitle>
            <DialogDescription>
              Preencha os campos para adicionar uma nova categoria
            </DialogDescription>
          </DialogHeader>
          <FormCategoria openOrClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <CategoriaTable />
    </div>
  );
};
