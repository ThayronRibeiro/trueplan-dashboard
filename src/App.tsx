import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";
import { TopMenu } from "./components/patterns/TopMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  return (
    <BrowserRouter>
      <TopMenu>
        <ToastContainer />
        <Fragment>
          <Routes>
            <Route path="/" element={<Chamados />} />
            <Route path="/categorias" element={<Chamados />} />
          </Routes>
        </Fragment>
      </TopMenu>
    </BrowserRouter>
  );
}

export default App;
