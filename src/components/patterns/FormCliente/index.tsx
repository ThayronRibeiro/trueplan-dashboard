import { formatarCPFCNPJ } from "@/app/functions/FormatarCpfCnpj";
import { formatarTelefone } from "@/app/functions/FormatarTelefone";
import { removerPontuacao } from "@/app/functions/RemoverPontuacao";
import { useClienteCnpjResponse } from "@/app/services/clienteCnpjResponse.service";
import { useClienteService } from "@/app/services/clientes.service";
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

const emptyStringToUndefined = z.literal("").transform(() => undefined);

export const FormSchema = z.object({
  cnpj: z
    .string({
      required_error: "Por favor, digite o CNPJ do cliente.",
    })
    .max(18),

  nomeFantasia: z.string({
    required_error: "Por favor, digite o nome fantasia do cliente.",
  }),
  razaoSocial: z.string({
    required_error: "Por favor, digite a razão social do cliente.",
  }),
  telefone1: z.string({
    required_error: "Por favor, digite o telefone do cliente",
  }),
  telefone2: z.optional(z.string()),
  email: z.optional(
    z
      .string()
      .email({
        message: "Por favor, digite um email válido!",
      })
      .or(emptyStringToUndefined)
  ),
});

// const onSubmit = (data: z.infer<typeof FormSchema>) => {
//   data.cnpj = removerPontuacao(data.cnpj);
//   return console.log(data);
// };

export const FormCliente = ({ children, openOrClose }: FormClienteProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const clienteCnpjResponseService = useClienteCnpjResponse();
  const clienteService = useClienteService();

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
      data.cnpj = removerPontuacao(data.cnpj);
      console.log(data);
      return clienteService.salvarCliente(data);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
          return clienteService.listarTodosOsClientes();
        },
      });
      notifySaveSucces();
      openOrClose();
    },
    onError: () => {
      notifyError();
    },
  });

  const handleInputChange = async (cnpj: string) => {
    const data = await clienteCnpjResponseService.getCnpj(
      removerPontuacao(cnpj)
    );

    //Preenchimento dos Dados
    if (data) {
      data.nome_fantasia == ""
        ? form.setValue("nomeFantasia", data.razao_social ?? "")
        : form.setValue("nomeFantasia", data.nome_fantasia ?? "");
      form.setValue("razaoSocial", data.razao_social ?? "");
      form.setValue("telefone1", data.ddd_telefone_1 ?? "");
      form.setValue("telefone2", data.ddd_telefone_2 ?? "");
      form.setValue("email", data.email ?? "");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="cnpj">CNPJ * </FormLabel>
                    <Input
                      placeholder="Digite o CNPJ do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue("cnpj", formatarCPFCNPJ(e.target.value));
                      }}
                      onBlur={() => handleInputChange(form.getValues("cnpj"))}
                      autoComplete="false"
                      maxLength={18}
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
                name="nomeFantasia"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="nomeFantasia">
                      Nome Fantasia *{" "}
                    </FormLabel>
                    <Input
                      placeholder="Digite o nome fantasia do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue("nomeFantasia", e.target.value);
                      }}
                      value={form.getValues("nomeFantasia")}
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="razaoSocial">Razão Social * </FormLabel>
                    <Input
                      placeholder="Digite a razão social do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue("razaoSocial", e.target.value);
                      }}
                      value={form.getValues("razaoSocial")}
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="telefone1"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="telefone1">Telefone </FormLabel>
                    <Input
                      placeholder="Digite o primeiro telefone do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue(
                          "telefone1",
                          formatarTelefone(e.target.value)
                        );
                      }}
                      value={form.getValues("telefone1")}
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="telefone2"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="telefone2">Telefone 2</FormLabel>
                    <Input
                      placeholder="Digite o segundo telefone do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue(
                          "telefone2",
                          formatarTelefone(e.target.value)
                        );
                      }}
                      value={form.getValues("telefone2")}
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      placeholder="Digite o email do cliente"
                      {...field}
                      onChange={(e) => {
                        form.setValue("email", e.target.value);
                      }}
                      value={form.getValues("email")}
                    />
                    <FormMessage />
                  </>
                )}
              />
            </div>
          </div>

          {/* <div className="col-span-2"></div>

          <div className="col-span-1"></div>

          <div className="col-span-1"></div>

          <div className="grid grid-cols-6 gap-3">
            <div className="flex-col space-y-2 col-span-4"></div>
          </div> */}

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
