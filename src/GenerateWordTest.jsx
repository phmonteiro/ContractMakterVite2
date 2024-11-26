import { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import "./Modal.css"; // Custom CSS for modal styling


const GenerateWordTest = ({ clauses }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const generateDocument = () => {
    if (clauses && Array.isArray(clauses)) {
      const paragraphs = clauses.map((item) => [
        new Paragraph({
          children: [new TextRun({ text: item.nome || 'No name available', bold: true })],
        }),
        new Paragraph(item.texto || 'No text available')
      ]).flat();

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      Packer.toBlob(doc)
        .then((blob) => saveAs(blob, "generated-document.docx"))
        .catch((error) => console.error("Error generating document:", error));
    } else {
      console.error("Invalid or empty clauses array");
    }
  };

  return (
    <div>
      <button onClick={openModal}>Generate Word Document</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Generate Word Document</h2>
            <p>Click the button to generate a Word document with the clauses!</p>
            <button onClick={generateDocument}>Generate</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateWordTest;
