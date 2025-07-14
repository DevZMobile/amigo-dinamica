import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConnection";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Fotos from "../../components/fotos";
import "./escolher_amigo.css";

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

export default function Escolha() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, allPeople } = location.state;

  // Filtra as pessoas removendo o usuário atual e já votadas
  const [remainingPeople, setRemainingPeople] = useState(
    allPeople.filter((person) => person.id !== currentUser.id)
  );
  const [votes, setVotes] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = allPeople.length - 1; // Total de pessoas para votar

  // Verifica se já votou em todos
  useEffect(() => {
    if (remainingPeople.length === 0) {
      submitAllVotes();
    }
  }, [remainingPeople]);

  const handleAttributeSelect = (attr) => {
    setSelectedAttribute(attr);
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    setSelectedAttribute(""); // Reseta o atributo ao selecionar nova pessoa
  };

  const handleVote = async () => {
    if (!selectedPerson || !selectedAttribute) return;

    const newVote = {
      voter: currentUser.name,
      voterId: currentUser.id,
      votedPerson: selectedPerson.name,
      votedPersonId: selectedPerson.id,
      attribute: selectedAttribute,
      timestamp: new Date(),
    };

    setVotes([...votes, newVote]);
    setRemainingPeople(
      remainingPeople.filter((p) => p.id !== selectedPerson.id)
    );
    setSelectedPerson(null);
    setSelectedAttribute("");
    setCurrentStep(currentStep + 1);
  };

  // ... (código anterior permanece igual até a função submitAllVotes)

  const submitAllVotes = async () => {
    setIsSubmitting(true);

    try {
      // Verifica se já votou em todos anteriormente
      const q = query(
        collection(db, "votes"),
        where("voterId", "==", currentUser.id),
        where("phase", "==", 1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size >= totalSteps) {
        alert("Você já completou todas as votações da fase 1!");
        navigate("/grande-amigo", { state: { currentUser, allPeople } });
        return;
      }

      // Adiciona fase 1 aos votos
      const votesWithPhase = votes.map((vote) => ({ ...vote, phase: 1 }));

      // Envia todos os votos de uma vez
      const batch = votesWithPhase.map((vote) =>
        addDoc(collection(db, "votes"), vote)
      );

      await Promise.all(batch);
      navigate("/grande-amigo", { state: { currentUser, allPeople } });
    } catch (error) {
      console.error("Erro ao registrar votos:", error);
      alert("Ocorreu um erro ao registrar suas votações");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (o restante do código permanece igual)

  return (
    <div className="vote-container">
      <h1>Atribua Qualidades aos Colegas</h1>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
        ></div>
        <span>
          Progresso: {currentStep - 1}/{totalSteps}
        </span>
      </div>

      <p className="welcome-message">
        Olá, {currentUser.name}! Escolha um atributo para cada colega.
        <br />
        {remainingPeople.length > 0
          ? `Restam ${remainingPeople.length} colegas para votar`
          : "Você votou em todos! Enviando..."}
      </p>

      {remainingPeople.length > 0 ? (
        <>
          <div className="selection-section">
            <h3 className="section-title">Selecione um colega:</h3>
            <Fotos
              people={remainingPeople}
              onSelectPerson={handlePersonSelect}
              selectionMode="vote"
            />

            {selectedPerson && (
              <>
                <h3 className="selected-person">
                  Você selecionou: {selectedPerson.name}
                </h3>

                <div className="attributes-section">
                  <h4>Escolha um atributo para {selectedPerson.name}:</h4>
                  <div className="attributes-container">
                    {attributes.map((attr) => (
                      <button
                        key={attr}
                        className={`attribute-option ${
                          selectedAttribute === attr ? "selected" : ""
                        }`}
                        onClick={() => handleAttributeSelect(attr)}
                        disabled={votes.some((v) => v.attribute === attr)}
                      >
                        {attr}
                        {votes.some((v) => v.attribute === attr) && (
                          <span className="attribute-used">(já usado)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedPerson && selectedAttribute && (
              <button
                className="confirm-button"
                onClick={handleVote}
                disabled={isSubmitting}
              >
                Confirmar: {selectedPerson.name} → {selectedAttribute}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="loading-message">
          <p>Processando suas votações...</p>
        </div>
      )}
    </div>
  );
}
