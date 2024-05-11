import { converterData } from "@/app/functions/ConverterData";
import { formatarDataController } from "@/app/functions/FormatarDataController";
import { formatarDataISO } from "@/app/functions/FormatarDataISO";
import { Chamado } from "@/app/models/chamado";
import { TypeError } from "@/app/models/utils/Error";
import { useChamadoService } from "@/app/services/chamados.service";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CalendarCheck, LoaderCircle } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

interface FormReagendamentoProps {
  openOrClose: () => void;
  children?: ReactNode;
  chamado: Chamado;
}

export const FormSchema = z.object({
  dataChamado: z.string({
    required_error: "Por favor, selecione uma nova data.",
  }),
});

export const FormReagendamento = ({
  children,
  openOrClose,
  chamado,
}: FormReagendamentoProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const chamadoService = useChamadoService();
  const queryClient = useQueryClient();

  const notifySaveSucces = () =>
    toast.success("Reagendamento concluído com sucesso!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutate: onSubmit, isLoading }: any = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      chamado.dataChamado = converterData(data.dataChamado);
      return chamadoService.atualizarChamado(chamado);
    },
    onSuccess: () => {
      localStorage.setItem(
        "dataChamadoAtivo",
        formatarDataISO(chamado.dataChamado)
      );

      queryClient.prefetchQuery({
        queryKey: ["datasChamados"],
        queryFn: async () => {
          return chamadoService.listarDatas();
        },
      });

      queryClient.fetchQuery({
        queryKey: ["chamados"],
        queryFn: async () => {
          return chamadoService.listarChamadosPorData(
            formatarDataController(
              localStorage.getItem("dataChamadoAtivo") ?? ""
            )
          );
        },
      });
      openOrClose();
      notifySaveSucces();
    },
    onError: (err: AxiosError) => {
      notifyError(err.toJSON.toString());
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="dataChamado"
              render={({ field }) => (
                <>
                  <FormLabel htmlFor="descricao">Nova Data * </FormLabel>
                  <Input
                    placeholder="Digite a descrição da categoria"
                    {...field}
                    onChange={(e) => {
                      form.setValue("dataChamado", e.target.value);
                    }}
                    type="date"
                  />
                  <FormMessage />
                </>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="flex items-center bg-emerald-500 hover:bg-emerald-600"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
              Reagendando ...
            </>
          ) : (
            <>
              <CalendarCheck className="w-4 h-4 mr-2" />
              Reagendar
            </>
          )}
        </Button>

        {children}
      </form>
    </Form>
  );
};
