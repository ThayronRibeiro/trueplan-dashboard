import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";
import { TopMenu } from "./components/patterns/TopMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clientes } from "./pages/clientes";

export function App() {
  return (
    <BrowserRouter>
      <TopMenu>
        <ToastContainer />
        <Fragment>
          <Routes>
            <Route path="/" element={<Chamados />} />
            <Route path="/categorias" element={<Chamados />} />
            <Route path="/clientes" element={<Clientes />} />
          </Routes>
        </Fragment>
      </TopMenu>
    </BrowserRouter>
  );
}

export default App;
