import { useStatusChamadoService } from "@/app/services/status.service";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Save } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

interface FormClienteProps {
  statusChamado: StatusChamado;
  openOrClose: () => void;
  children?: ReactNode;
}

export const FormSchema = z.object({
  id: z.optional(z.string()),
  descricao: z.optional(z.string()),
  corBackground: z.string({
    required_error: "Por favor, selecione uma cor de background.",
  }),
  corLetras: z.string({
    required_error: "Por favor, selecione a cor das letras.",
  }),
});

export const FormStatus = ({
  statusChamado,
  children,
  openOrClose,
}: FormClienteProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const statusChamadoService = useStatusChamadoService();

  const notifySaveSucces = () =>
    toast.success("Status atualizado com sucesso!", {
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

  const notifyError = () =>
    toast.error("Erro ao atualizar Status!", {
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

  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutate: onSubmit, isLoading }: any = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      data.id = statusChamado.id;
      data.descricao = statusChamado.descricao;
      console.log(data);
      return statusChamadoService.atualizarStatus(data);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
          return statusChamadoService.listarTodosStatus();
        },
      });
      notifySaveSucces();
      openOrClose();
    },
    onError: () => {
      notifyError();
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="descricao">Descrição </FormLabel>
                    <Input
                      placeholder="Digite a descrição da categoria"
                      {...field}
                      defaultValue={statusChamado.descricao}
                      disabled
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="corBackground"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="corBackground">
                      Cor Background{" "}
                    </FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        form.setValue("corBackground", e.target.value);
                      }}
                      defaultValue={`${statusChamado.corBackground}`}
                      type="color"
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>

            <div className="col-span-3">
              <FormField
                control={form.control}
                name="corLetras"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="corLetras">Cor Letras </FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        form.setValue("corLetras", e.target.value);
                      }}
                      defaultValue={`${statusChamado.corLetras}`}
                      type="color"
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
                Salvando ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>

          {children}
        </form>
      </Form>
    </>
  );
};
