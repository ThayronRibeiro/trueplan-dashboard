import { StatusTable } from "@/components/patterns/StatusTable";
import { Separator } from "@/components/ui/separator";

export const Status = () => {
  //const [open, setOpen] = useState(false);

  return (
    <div className="p-2">
      <div className="flex w-full justify-between align-middle mt-2 mb-2">
        <h1 className="font-bold ml-4 text-lg text-neutral-800">Status</h1>
      </div>
      <Separator></Separator>
      <StatusTable />
    </div>
  );
};
