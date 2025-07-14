import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Escolha from "../pages/Escolher_amigo";
import Resultados from "../pages/Resultados";
import GrandeAmigo from "../pages/Grande_Amigo";
import Obrigado from "../pages/Obrigado";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escolha" element={<Escolha />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/grande-amigo" element={<GrandeAmigo />} />
        <Route path="/obrigado" element={<Obrigado />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterApp;
