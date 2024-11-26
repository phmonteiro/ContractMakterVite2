import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import GenerateWordTest from "./GenerateWordTest";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";
import "./Modal.css"; // Custom CSS for modal styling
import {Buffer} from 'buffer';
import fidLogo from './assets/logo.png';

// Regular expression to match placeholders like <*text*>
const placeholderRegex = /<([^<>]+)>/g;
Modal.setAppElement('#root');

const ClauseEditor = ({clauses}) => {  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [editedClauses, setEditedClauses] = useState(clauses);
    
  useEffect(() => {
    setEditedClauses(clauses);
  }, [clauses]);

  const placeholdersByClause = useMemo(() => {
    if (!editedClauses) return [];
      return editedClauses.map((clause) => {
        const matches = [...clause.texto.matchAll(placeholderRegex)];
        const placeholders = [...new Set(matches.map((match) => match[1]))];
        return { clauseId: clause.id, nome: clause.nome, placeholders };
      });
  }, [editedClauses]);  

  // Open modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Handle input change
  const handleChange = (event, placeholder) => {
    setInputValues({
      ...inputValues,
      [placeholder]: event.target.value,
    });
  };

  const fetchImageAsBase64 = async () => {
    // Convert the imported image to Base64
    const response = await fetch(fidLogo);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Base64 string
      reader.readAsDataURL(blob);
    });
  };
  
  const generateDocument = async (updatedClauses) => {
    const base64Image = await fetchImageAsBase64();

    if (updatedClauses && Array.isArray(updatedClauses)) {
      console.log(updatedClauses);
      
/*       const paragraphs = updatedClauses.map((item) => [
        new Paragraph({
          children: [new TextRun({ text: item.nome || 'No name available', bold: true })],
        }),
        new Paragraph(item.texto || 'No text available')
      ]).flat(); */

      const paragraphs = [];

       clauses.forEach((item) => {
        // Title paragraph
        const title = new Paragraph({
          children: [
            new TextRun({
              text: item.nome || 'No name available',
              bold: true,
              size: 28, // adjust font size as needed
            }),
          ],
          alignment: "center",
        });

        paragraphs.push(title);
        paragraphs.push(new Paragraph({ children: [] }));
        // Replace escaped '\n' with actual line breaks and split the text into lines
        const textLines = item.texto.replace(/\\n/g, '\n').split('\n');
    
        textLines.forEach((line) => {
          // Split each line further based on the "1." to "99." pattern
          const parts = line.split(/(\b\d{1,2}\.\s)/g);
    
          const textRuns = parts.map((part, index) => {
            const isNumberedPattern = /\b\d{1,2}\.\s/.test(part); // Check if it's a numbered pattern
            return new TextRun({
              text: part,
              break: isNumberedPattern && index < parts.length - 1, // Add break if it's a numbered pattern
            });
          });
    
          // Add the processed line as a new paragraph
          paragraphs.push(new Paragraph({ children: textRuns }));
          paragraphs.push(new Paragraph({ children: [] }));
        });
      });


      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
               /* new Paragraph({
                children: [
                  new ImageRun({
                    data: Buffer.from(base64Image, "base64"), // Use the Base64 image
                    transformation: { width: 660, height: 330 },
                  }),
                ],
              }), 
              ... */...paragraphs,
            ],
          },
        ],
      });

      Packer.toBlob(doc)
        .then((blob) => saveAs(blob, "generated-contract.docx"))
        .catch((error) => console.error("Error generating document:", error));
    } else {
      console.error("Invalid or empty clauses array");
    }
  };
// Replace placeholders in clause text
const replacePlaceholders = (text) => {
  const replacedText = text.replace(placeholderRegex, (match, p1) => {
    const replacement = inputValues[p1];
    return replacement || match; // Use match if no replacement is found
  });
  return replacedText;
};

  const applyReplacements = () => {
  const updatedClauses = editedClauses.map((clause) => ({
    ...clause,
    texto: replacePlaceholders(clause.texto),
  }));
  setEditedClauses(updatedClauses);
  return updatedClauses; // Return the updated clauses
};

const generateWord = () => {
  const updatedClauses = applyReplacements(); // Get updated clauses
  console.log(updatedClauses)

  generateDocument(updatedClauses); // Pass them directly
  closeModal();
};

  return (
    <div>
      <button onClick={openModal}>Manage Selected Clauses</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Edit Placeholders</h2>
        {placeholdersByClause && placeholdersByClause.map(({ clauseId, nome, placeholders }) => (
          <div key={clauseId}>
            <h3>{nome}</h3>
            {placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label>
                  {placeholder}:
                  <input
                    type="text"
                    value={inputValues[placeholder] || ""}
                    onChange={(e) => handleChange(e, placeholder)}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={applyReplacements}>Apply Changes</button>
        <button onClick={generateWord}>Generate Word Document</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
      {false && <div>
        <h3>Clauses</h3>
        {editedClauses && editedClauses.map((clause) => (
          <div key={clause.id}>
            <h4>{clause.nome}</h4>
            <p>{clause.text}</p>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default ClauseEditor;
