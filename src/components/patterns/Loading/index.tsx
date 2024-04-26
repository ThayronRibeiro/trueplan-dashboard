import { LoaderCircle } from "lucide-react";

export const Loading = () => {
  return (
    <div
      className="flex w-full h-[100vh] align-middle justify-center fixed left-0 top-0 z-50 bg-slate-500 opacity-20
    items-center
    "
    >
      <LoaderCircle className="animate-spin w-[5rem] h-[5rem] text-white" />
    </div>
  );
};
