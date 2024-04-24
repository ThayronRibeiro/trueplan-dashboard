import { formatarCPFCNPJ } from "@/app/functions/FormatarCpfCnpj";
import { formatarTelefone } from "@/app/functions/FormatarTelefone";
import { removerPontuacao } from "@/app/functions/RemoverPontuacao";
import { ClienteCnpjResponse } from "@/app/models/clienteCnpjResponse";
import { useClienteCnpjResponse } from "@/app/services/clienteCnpjResponse.service";
import { useClienteService } from "@/app/services/clientes.service";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

interface FormClienteProps {
  children?: ReactNode;
}

export const FormSchema = z.object({
  cnpj: z
    .string({
      required_error: "Por favor digite o CNPJ do cliente.",
    })
    .max(18),

  nomeFantasia: z.string({
    required_error: "Por favor digite o nome fantasia do cliente.",
  }),
  razaoSocial: z.string({
    required_error: "Por favor digite a razão social do cliente.",
  }),
  telefone1: z.string({
    required_error: "Por favor digite um telefone do cliente",
  }),
  telefone2: z.string({
    required_error: "Por favor digite um telefone do cliente",
  }),
});

// const onSubmit = (data: z.infer<typeof FormSchema>) => {
//   data.cnpj = removerPontuacao(data.cnpj);
//   return console.log(data);
// };

export const FormCliente = ({ children }: FormClienteProps) => {
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

  const { mutate: onSubmit }: any = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      data.cnpj = removerPontuacao(data.cnpj);
      console.log(data);
      notifySaveSucces();
      return clienteService.salvarCliente(data);
    },
  });

  //const [preenchimentoRealizado, setPreenchimentoRealizado] = useState(false);

  const [dadosClientes, setDadosClientes] = useState<ClienteCnpjResponse>();

  const handleInputChange = (cnpj: string) => {
    clienteCnpjResponseService.getCnpj(removerPontuacao(cnpj)).then((data) => {
      setDadosClientes(data);
    });
    //Preenchimento dos Dados
    dadosClientes?.nome_fantasia == ""
      ? form.setValue("nomeFantasia", dadosClientes?.razao_social ?? "")
      : form.setValue("nomeFantasia", dadosClientes?.nome_fantasia ?? "");
    form.setValue("razaoSocial", dadosClientes?.razao_social ?? "");
    form.setValue("telefone1", dadosClientes?.ddd_telefone_1 ?? "");
    form.setValue("telefone2", dadosClientes?.ddd_telefone_2 ?? "");
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
                      onBlur={() => {
                        handleInputChange(form.getValues("cnpj"));
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
                      placeholder="Digite a razão social do cliente"
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
                      placeholder="Digite a razão social do cliente"
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
          </div>

          {/* <div className="col-span-2"></div>

          <div className="col-span-1"></div>

          <div className="col-span-1"></div>

          <div className="grid grid-cols-6 gap-3">
            <div className="flex-col space-y-2 col-span-4"></div>
          </div> */}

          <DialogClose>
            <Button
              type="submit"
              className="flex items-center bg-emerald-500 hover:bg-emerald-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogClose>
          {children}
        </form>
      </Form>
    </>
  );
};
