import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";
import { TopMenu } from "./components/patterns/TopMenu";

export function App() {
  return (
    <BrowserRouter>
      <TopMenu>
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
