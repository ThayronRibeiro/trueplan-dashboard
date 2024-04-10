import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AlignJustify } from "lucide-react";
import { Fragment, ReactNode } from "react";

interface TopMenuProps {
  children: ReactNode;
}

export const TopMenu = ({ children }: TopMenuProps) => {
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger>
          <div className="fixed top-0 w-[100vw] h-12 bg-blue-600 flex items-center justify-end p-5 z-20">
            <AlignJustify className="text-white mr-5" />
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ScrollArea className="pt-6">{children}</ScrollArea>
    </Fragment>
  );
};
