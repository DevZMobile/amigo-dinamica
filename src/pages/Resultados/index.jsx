import { useState, useEffect } from "react";
import { db } from "../../firebaseConnection";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./resultados.css";

export default function Resultados() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Senha de acesso (em produção, usar autenticação segura)
  const RH_PASSWORD = "rh@acesso123";

  useEffect(() => {
    if (authenticated) {
      fetchVotingData();
    }
  }, [authenticated]);

  const fetchVotingData = async () => {
    try {
      const votesSnapshot = await getDocs(collection(db, "votes"));
      const votesData = votesSnapshot.docs.map((doc) => doc.data());

      // Processa os dados para agrupar por pessoa votada
      const peopleMap = {};
      const grandeAmigoVoters = new Set(); // Para rastrear votantes únicos

      votesData.forEach((vote) => {
        if (!peopleMap[vote.votedPersonId]) {
          peopleMap[vote.votedPersonId] = {
            id: vote.votedPersonId,
            name: vote.votedPerson,
            attributes: {},
            grandeAmigo: {
              count: 0,
              attributes: {},
              voters: new Set(), // Rastreia quem votou nesta pessoa como Grande Amigo
            },
          };
        }

        const person = peopleMap[vote.votedPersonId];

        // Votação normal (fase 1)
        if (vote.phase === 1) {
          person.attributes[vote.attribute] =
            (person.attributes[vote.attribute] || 0) + 1;
        }

        // Votação "Grande Amigo" (fase 2)
        if (vote.isGrandeAmigo && vote.voterId) {
          // Verifica se este votante já foi contado para esta pessoa
          if (!person.grandeAmigo.voters.has(vote.voterId)) {
            person.grandeAmigo.count++;
            person.grandeAmigo.voters.add(vote.voterId);
          }

          // Contabiliza o atributo selecionado
          person.grandeAmigo.attributes[vote.attribute] =
            (person.grandeAmigo.attributes[vote.attribute] || 0) + 1;
        }
      });

      setPeople(Object.values(peopleMap));
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === RH_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Senha incorreta. Acesso restrito ao RH.");
    }
  };

  if (!authenticated) {
    return (
      <div className="login-container">
        <h2>Acesso Restrito ao RH</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha de acesso"
            required
          />
          <button type="submit">Acessar</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Carregando resultados...</div>;
  }

  const getTopAttributes = (attributes, count = 3) => {
    const entries = Object.entries(attributes);
    if (entries.length === 0) return [];

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([attr]) => attr);
  };

  return (
    <div className="results-container">
      <h1>Resultados da Votação - RH</h1>

      <div className="people-grid">
        {people.map((person) => (
          <div
            key={person.id}
            className={`person-card ${
              selectedPerson?.id === person.id ? "selected" : ""
            }`}
            onClick={() => setSelectedPerson(person)}
          >
            <div className="person-photo">
              <div className="photo-placeholder">{person.name.charAt(0)}</div>
            </div>
            <h3>{person.name}</h3>
            <div className="person-stats">
              {person.grandeAmigo.count > 0 && (
                <span className="grande-amigo-tag">
                  Grande Amigo: {person.grandeAmigo.count}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPerson && (
        <div className="person-details">
          <h2>Detalhes: {selectedPerson.name}</h2>

          <div className="details-section">
            <h3>Atributos mais votados (Fase 1)</h3>
            {Object.keys(selectedPerson.attributes || {}).length > 0 ? (
              <div className="phase1-attributes">
                <div className="top-attributes">
                  {getTopAttributes(selectedPerson.attributes, 3).map(
                    (attr) => (
                      <div key={attr} className="top-attribute">
                        <span className="attribute-name">{attr}</span>
                        <span className="attribute-count">
                          {selectedPerson.attributes[attr]} votos
                        </span>
                      </div>
                    )
                  )}
                </div>
                {Object.keys(selectedPerson.attributes).length > 3 && (
                  <div className="other-attributes">
                    <h4>Outros atributos:</h4>
                    <div className="attributes-list">
                      {Object.entries(selectedPerson.attributes)
                        .sort((a, b) => b[1] - a[1])
                        .slice(3)
                        .map(([attr, count]) => (
                          <div key={attr} className="attribute-item">
                            <span className="attribute-name">{attr}</span>
                            <span className="attribute-count">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-attributes">
                Nenhum atributo votado nesta fase.
              </p>
            )}
          </div>

          {selectedPerson.grandeAmigo.count > 0 && (
            <div className="details-section">
              <h3>Dados como Grande Amigo</h3>
              <div className="grande-amigo-data">
                <p>
                  Foi escolhido como <strong>Grande Amigo</strong> por{" "}
                  {selectedPerson.grandeAmigo.count}{" "}
                  {selectedPerson.grandeAmigo.count === 1
                    ? "pessoa"
                    : "pessoas"}
                  .
                </p>

                <h4>Atributos associados:</h4>
                {Object.keys(selectedPerson.grandeAmigo.attributes).length >
                0 ? (
                  <div className="attributes-grid">
                    {Object.entries(selectedPerson.grandeAmigo.attributes).map(
                      ([attr, count]) => (
                        <div key={attr} className="attribute-tag">
                          {attr}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>Nenhum atributo específico foi associado.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
