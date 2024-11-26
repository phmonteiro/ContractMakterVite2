import React, { useState } from "react";
import "./Modal.css"; // Custom styles for the modal
import GenerateWord from "./GenerateWord";


const clauses = [
  {
    id: 1,
    nome: "Cláusula Preliminar",
    tipo: "aceite",
    versao: "proporcional",
    ambito: "geral",
    text:
      "Entre a <Cedente>, com sede no <Morada da Cedente>, na qualidade de <Cedente>, e <Reinsurer>, com sede em <Morada>, <Local>, na qualidade de <Ressegurador>, é estabelecido o presente Tratado de Resseguro (o “Tratado”), nos termos e condições constantes das Cláusulas seguintes:",
  },
  {
    id: 2,
    nome: "Cláusula Segunda",
    tipo: "aceite",
    versao: "proporcional",
    ambito: "geral",
    text: "Negócio com <Primeira Empresa> e também com <Segunda Empresa> ",
  },
];

const ReplaceVariablesModal = ({closeModal, isOpen}) => {
  const [inputs, setInputs] = useState({});

  // Function to extract patterns like <*word*> and create text inputs
  const extractPatternAndInputs = (clauseText, id) => {
    const pattern = /<\*(.*?)\*>/g;
    let match;
    const inputsForClause = {};

    const updatedText = clauseText.replace(pattern, (match, p1) => {
      if (!inputsForClause[p1]) {
        inputsForClause[p1] = ""; // Initial value for each detected pattern
      }
      return `<input-${p1}-${id}>`; // Placeholder to be replaced with actual input elements
    });

    return { updatedText, inputsForClause };
  };

  // Function to handle input change
  const handleInputChange = (id, label, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [label]: value },
    }));
  };

  // Function to replace the patterns with inputs
  const renderTextWithInputs = (text, clauseId) => {
    const inputPlaceholders = text.match(/<input-(.*?)-(\d+)>/g);
    let renderedText = text;

    if (inputPlaceholders) {
      inputPlaceholders.forEach((placeholder) => {
        const label = placeholder.match(/input-(.*?)-\d+/)[1];
        renderedText = renderedText.replace(
          placeholder,
          `<input type="text" name="${label}" required id="${label}-${clauseId}" />`
        );
      });
    }

    return renderedText;
  };

  const handleSubmit = () => {
    // Replace all <*word*> with the corresponding input value in the final text
    const updatedClauses = clauses.map((clause) => {
      let updatedText = clause.text;
      if (inputs[clause.id]) {
        Object.keys(inputs[clause.id]).forEach((key) => {
          updatedText = updatedText.replace(
            new RegExp(`<\\*${key}\\*>`, "g"),
            inputs[clause.id][key]
          );
        });
      }
      return { ...clause, texto: updatedText };
    });

    closeModal(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
  <div>
    {isOpen && <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
        <div className="clause-list">
          {clauses.map((clause) => {
            const { updatedText, inputsForClause } = extractPatternAndInputs(
              clause.text,
              clause.id
            );
            return (
              <div key={clause.id} className="clause-item">
                <h3>{clause.nome}</h3>
                <p>{clause.tipo} - {clause.versao} - {clause.ambito}</p>
                <div className="clause-text">
                  {Object.keys(inputsForClause).map((inputLabel) => (
                    <div key={inputLabel}>
                      <label htmlFor={inputLabel}>{inputLabel}</label>
                      <input
                        type="text"
                        id={inputLabel}
                        required
                        value={inputs[clause.id]?.[inputLabel] || ""}
                        onChange={(e) =>
                          handleInputChange(clause.id, inputLabel, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <p>{renderTextWithInputs(updatedText, clause.id)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>}
  </div>
  );
};

export default ReplaceVariablesModal;
