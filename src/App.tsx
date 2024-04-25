import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";
import { TopMenu } from "./components/patterns/TopMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clientes } from "./pages/clientes";
import { Categoria } from "./pages/categorias";
import { Status } from "./pages/status";

export function App() {
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
