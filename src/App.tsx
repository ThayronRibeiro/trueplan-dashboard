import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";
import { TopMenu } from "./components/patterns/TopMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clientes } from "./pages/clientes";
import { Categoria } from "./pages/categorias";
import { Status } from "./pages/status";
import { useQuery } from "@tanstack/react-query";
import { useChamadoService } from "./app/services/chamados.service";
import { useClienteService } from "./app/services/clientes.service";
import { useCategoriaService } from "./app/services/categoria.service";

export function App() {
  const chamadoService = useChamadoService();
  const clienteService = useClienteService();
  const categoriaService = useCategoriaService();

  const { data: datasChamados } = useQuery({
    queryKey: ["datasChamados"],
    queryFn: () => chamadoService.listarDatas(),
    staleTime: 60000 * 60 * 24,
  });

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => clienteService.listarTodosOsClientes(),
    staleTime: 300000,
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => categoriaService.listarTodasAsCategorias(),
    staleTime: 300000,
  });

  return (
    <BrowserRouter>
      <TopMenu>
        <ToastContainer />
        <Fragment>
          <Routes>
            <Route path="/" element={<Chamados />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/categorias" element={<Categoria />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </Fragment>
      </TopMenu>
    </BrowserRouter>
  );
}

export default App;
