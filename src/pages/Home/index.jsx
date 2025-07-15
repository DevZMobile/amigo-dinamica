import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fotos from "../../components/fotos";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [erro, setErro] = useState("");

  const people = [
    { id: 1, name: "Anna", photo: "/fotos/ana.png" },
    { id: 2, name: "Márcio", photo: "/fotos/marcio.png" },
    { id: 3, name: "Cassia", photo: "/fotos/cassia.png" },
    { id: 4, name: "Ellen", photo: "/fotos/ellen.png" },
    { id: 5, name: "Maria Eduarda", photo: "/fotos/duda.png" },
    { id: 6, name: "Patrícia", photo: "/fotos/patricia.png" },
    { id: 7, name: "Ricardo", photo: "/fotos/ricardo.png" },
    { id: 8, name: "Adelson", photo: "/fotos/adelson.png" },
    { id: 9, name: "Evmarques", photo: "/fotos/evmarques.png" },
    { id: 10, name: "Gleiciano", photo: "/fotos/gleiciano.png" },
    { id: 11, name: "Cassio", photo: "/fotos/cassio.png" },
    { id: 12, name: "Alexssandro", photo: "/fotos/alexssandro.png" },
    { id: 13, name: "Julia", photo: "/fotos/julia.png" },
    { id: 14, name: "Juliana", photo: "/fotos/juliana.png" },
    { id: 15, name: "Mayara", photo: "/fotos/mayara.png" },
    { id: 16, name: "Raimunda", photo: "/fotos/raimunda.png" },
    { id: 17, name: "Rebeca", photo: "/fotos/rebeca.png" },
    { id: 18, name: "Tiago Guerra", photo: "/fotos/tiagoG.png" },
    { id: 19, name: "Hiasmim", photo: "/fotos/yasmin.png" },
    { id: 20, name: "Geraldo", photo: "/fotos/geraldo.png" },
    { id: 21, name: "Alexandra", photo: "/fotos/alexandra.png" },
    { id: 22, name: "Bruna", photo: "/fotos/bruna.png" },
    { id: 23, name: "Davi - Aprendiz", photo: "/fotos/davi.png" },
    { id: 24, name: "Emanoelly", photo: "/fotos/emanoelly.png" },
    { id: 25, name: "Josiele", photo: "/fotos/josiele.png" },
    { id: 26, name: "Luzitânia", photo: "/fotos/luzitania.png" },
    { id: 27, name: "Marjorie", photo: "/fotos/marjorie.png" },
    { id: 28, name: "Rose", photo: "/fotos/rose.png" },
    { id: 29, name: "Camila", photo: "/fotos/camila.png" },
    { id: 30, name: "Tatiane", photo: "/fotos/tatiane.png" },
    { id: 31, name: "Victoria", photo: "/fotos/victoria.png" },
    { id: 32, name: "Vitor", photo: "/fotos/vitor.png" },
    { id: 33, name: "João Bubach", photo: "/fotos/joao.png" },
    { id: 34, name: "Alda Bubach", photo: "/fotos/alda.png" },
    { id: 35, name: "Jorge Bubach", photo: "/fotos/jorge.png" },
    { id: 36, name: "Marineide (Efetive)", photo: "/fotos/mary.png" },
    { id: 37, name: "Tiago Salles", photo: "/fotos/tiagoS.png" },
    { id: 38, name: "Adalmo", photo: "/fotos/adalmo.png" },
    { id: 39, name: "Flávio", photo: "/fotos/fagundes.png" },
    // Adicione mais pessoas conforme necessário
  ];

  function handleParticipate() {
    if (!selectedUser) {
      setErro("Por favor, selecione sua foto");
      return;
    }

    navigate("/escolha", {
      state: {
        currentUser: {
          id: selectedUser.id,
          name: selectedUser.name,
        },
        allPeople: people,
      },
    });
  }

  function handleRhAccess() {
    navigate("/resultados");
  }

  return (
    <div className="container">
      <div className="container-secundario">
        <h1>DINÂMICA - DIA DO AMIGO</h1>
        <p>Selecione sua foto para participar:</p>

        <div className="photo-selection">
          <Fotos
            people={people}
            onSelectPerson={setSelectedUser}
            selectionMode="self"
          />
        </div>

        {selectedUser && (
          <p className="selected-indicator">
            <span style={{ color: "black" }}>Você selecionou:</span>{" "}
            {selectedUser.name}
          </p>
        )}

        {erro && <p className="erro">{erro}</p>}

        <div className="buttons-container">
          <button onClick={handleParticipate} className="main-button">
            {selectedUser
              ? `Participar como ${selectedUser.name}`
              : "Participar da Dinâmica"}
          </button>

          <button onClick={handleRhAccess} className="rh-button">
            Acesso do (RH)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
