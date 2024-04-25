import { useCategoriaService } from "@/app/services/categoria.service";
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
  openOrClose: () => void;
  children?: ReactNode;
}

export const FormSchema = z.object({
  descricao: z.string({
    required_error: "Por favor, digite a descrição da categoria.",
  }),
});

export const FormCategoria = ({ children, openOrClose }: FormClienteProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const categoriaService = useCategoriaService();

  const notifySaveSucces = () =>
    toast.success("Cadastrado com sucesso!", {
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
    toast.error("Erro ao cadastrar cliente!", {
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
      console.log(data);
      return categoriaService.salvarCategoria(data);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
          return categoriaService.listarTodasAsCategorias();
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
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="descricao">Descrição * </FormLabel>
                    <Input
                      placeholder="Digite a descrição da categoria"
                      {...field}
                      onChange={(e) => {
                        form.setValue(
                          "descricao",
                          e.target.value.toLocaleUpperCase()
                        );
                      }}
                      autoComplete="false"
                      maxLength={18}
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
