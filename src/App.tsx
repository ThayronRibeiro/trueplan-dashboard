import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Chamados } from "./pages/chamados";

export function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<Chamados />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
