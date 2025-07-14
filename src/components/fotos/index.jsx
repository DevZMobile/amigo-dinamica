import { useState } from "react";
import "./fotos.css";

const Fotos = ({ people, onSelectPerson, selectionMode }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (person) => {
    setSelectedId(person.id);
    onSelectPerson(person);
  };

  return (
    <div className="fotos-container">
      {people.map((person) => (
        <div
          key={person.id}
          className={`foto-item ${selectedId === person.id ? "selected" : ""}`}
          onClick={() => handleClick(person)}
        >
          <img
            src={person.photo}
            alt={person.name}
            onError={(e) => {
              e.target.src = "/placeholder-user.png"; // Fallback para imagem quebrada
            }}
          />
          <span className="person-name">{person.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Fotos;
