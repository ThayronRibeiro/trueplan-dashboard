import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { Fragment, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

interface TopMenuProps {
  children: ReactNode;
}

export const TopMenu = ({ children }: TopMenuProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <Fragment>
      <div className="fixed top-0 w-[100vw] h-12 bg-blue-600 flex items-center justify-end p-5 z-50 gap-3">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="bg-slate-50 flex flex-col mr-5 w-[14em] space-y-2">
            <Link
              to="/conta"
              onClick={() => {
                setOpenPopover(false);
              }}
            >
              Minha Conta
            </Link>
            <Link
              to="/configuracoes"
              onClick={() => {
                setOpenPopover(false);
              }}
            >
              Configurações
            </Link>
            <Separator />
            Sair
          </PopoverContent>
        </Popover>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger>
            <AlignJustify className="text-white mr-5" />
          </SheetTrigger>
          <SheetContent className="flex flex-col font-bold">
            <Link
              to="/"
              onClick={() => {
                setOpenSheet(false);
              }}
              className="hover:translate-x-2 transition-all ease-in-out"
            >
              Chamados
            </Link>
            <Link
              to="/clientes"
              onClick={() => {
                setOpenSheet(false);
              }}
              className="hover:translate-x-2 transition-all ease-in-out"
            >
              Clientes
            </Link>
            <Link
              to="/categorias"
              onClick={() => {
                setOpenSheet(false);
              }}
              className="hover:translate-x-2 transition-all ease-in-out"
            >
              Categorias
            </Link>
            <Link
              to="/status"
              onClick={() => {
                setOpenSheet(false);
              }}
              className="hover:translate-x-2 transition-all ease-in-out"
            >
              Status
            </Link>
          </SheetContent>
        </Sheet>
      </div>
      <div className="pt-10">{children}</div>
    </Fragment>
  );
};
