import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConnection";
import { collection, addDoc } from "firebase/firestore";
import Fotos from "../../components/fotos";
import "./grande-amigo.css";

const attributes = [
  "Engraçado",
  "Brincalhão",
  "Sonhador",
  "Atento",
  "Acolhedor",
  "Curioso",
  "Agitado",
  "Inspirador",
  "Misterioso",
  "Corajoso",
  "Carinhoso",
  "Alegre",
  "Leal",
  "Ousado",
  "Inteligente",
  "Criativo",
  "Espontâneo",
  "Charmoso",
  "Cantarolante",
  "Sensível",
  "Otimista",
  "Tímido",
  "Cheiroso",
  "Comunicativo",
  "Idealista",
  "Autêntico",
  "Dinâmico",
  "Brilhante",
  "Festeiro",
  "Conselheiro",
  "Persistente",
  "Dedicado",
  "Sorridente",
  "Estiloso",
  "Sábio",
  "Alto Astral",
  "Paciente",
];

export default function GrandeAmigo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, allPeople } = location.state;

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttributeToggle = (attr) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleSubmit = async () => {
    if (!selectedPerson || selectedAttributes.length === 0) {
      alert("Por favor, selecione uma pessoa e pelo menos um atributo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Cria um voto para cada atributo selecionado
      const votes = selectedAttributes.map((attr) => ({
        voter: currentUser.name,
        voterId: currentUser.id,
        votedPerson: selectedPerson.name,
        votedPersonId: selectedPerson.id,
        attribute: attr,
        isGrandeAmigo: true,
        phase: 2,
        timestamp: new Date(),
      }));

      const batch = votes.map((vote) => addDoc(collection(db, "votes"), vote));

      await Promise.all(batch);
      alert("Seu voto para 'O Grande Amigo' foi registrado com sucesso!");
      navigate("/obrigado");
    } catch (error) {
      console.error("Erro ao registrar voto:", error);
      alert("Ocorreu um erro ao registrar seu voto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grande-amigo-container">
      <h1>Escolha O Grande Amigo</h1>
      <p className="instructions">
        Agora escolha quem foi <strong>O Grande Amigo</strong> para você neste
        ano.
        <br />
        Selecione uma pessoa e marque <strong>todos os atributos</strong> que se
        aplicam a ela.
      </p>

      <div className="selection-section">
        <h2>Selecione a pessoa:</h2>
        <Fotos
          people={allPeople.filter((p) => p.id !== currentUser.id)}
          onSelectPerson={setSelectedPerson}
          selectionMode="grande-amigo"
        />

        {selectedPerson && (
          <>
            <h3 className="selected-person">
              Você selecionou: <span>{selectedPerson.name}</span>
            </h3>

            <div className="attributes-section">
              <h2>Selecione os atributos:</h2>
              <div className="attributes-grid">
                {attributes.map((attr) => (
                  <button
                    key={attr}
                    className={`attribute-option ${
                      selectedAttributes.includes(attr) ? "selected" : ""
                    }`}
                    onClick={() => handleAttributeToggle(attr)}
                  >
                    {attr}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="confirm-button"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedAttributes.length === 0}
            >
              {isSubmitting
                ? "Enviando..."
                : `Confirmar ${selectedAttributes.length} atributos para ${selectedPerson.name}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
