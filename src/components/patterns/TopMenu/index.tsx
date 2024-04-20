import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";

interface TopMenuProps {
  children: ReactNode;
}

export const TopMenu = ({ children }: TopMenuProps) => {
  return (
    <Fragment>
      <div className="fixed top-0 w-[100vw] h-12 bg-blue-600 flex items-center justify-end p-5 z-50 gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="bg-slate-50 flex flex-col mr-5 w-[14em] space-y-2">
            <Link to="/conta">Minha Conta</Link>
            <Link to="/configuracoes">Configurações</Link>
            <Separator />
            Sair
          </PopoverContent>
        </Popover>
        <Sheet>
          <SheetTrigger>
            <AlignJustify className="text-white mr-5" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription className="flex flex-col text-black">
                <Link to="/clientes">Clientes</Link>
                <Link to="/categorias">Categorias</Link>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="pt-10">{children}</div>
    </Fragment>
  );
};
