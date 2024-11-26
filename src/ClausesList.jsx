import React, { useState, useEffect } from 'react';
import GenerateWord from './GenerateWord';
import GenerateWordTest from './GenerateWordTest';
import {FaPen} from "react-icons/fa";
import EditClauseModal from './EditClauseModal';
import ReplaceVariablesModal from './ReplaceVariablesModal';
import { MdFindReplace } from "react-icons/md";
import ClauseEditor from './ClauseEditor.jsx';
import { useDataContext } from "./context/DataContext.jsx";

const ClausesList = ({ ambito, contractFilters }) => {
  const { clauses, setClauses } = useDataContext();
  // State to store checkbox states
  const [checkedItems, setCheckedItems] = useState({});
  const [filteredClauses, setFilteredClauses] = useState([]);
  const [selectedClause, setSelectedClause] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplaceVariablesModalOpen, setIsReplaceVariablesModalOpen] = useState(false);

  // Sync `clauses` and `checkedItems` with `contractClauses` prop when it changes
  useEffect(() => {
    setClauses(clauses);

    // Initialize checked items with false for all clauses when clauses changes
    setCheckedItems(
      clauses.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
    );
  }, [clauses]);

  const setAllItemsChecked = () => {
    setCheckedItems((prevCheckedItems) =>
      clauses.reduce((acc, item) => {
        if (item.ambito === contractFilters.ambito) {
          // Invert the boolean for matching items
          return { ...acc, [item.id]: !prevCheckedItems[item.id] };
        }
        // Keep the previous value for other items
        return { ...acc, [item.id]: prevCheckedItems[item.id] ?? false };
      }, {})
    );
  }

  const toggleEditClauseModal = () => {
      setIsEditModalOpen((prevState) => {
      console.log("Modal toggling:", !prevState); // Debugging state
      return !prevState;
    });
    
  }

  const setEditClauseModalData = (item) => {
    setSelectedClause(item)
  }

  const toggleReplaceVariablesModal = (item) => {
    setSelectedClause(item)
    
    setIsReplaceVariablesModalOpen(!isReplaceVariablesModalOpen)
  }

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setFilteredClauses(clauses.filter((item) => {
      return (
        (!contractFilters?.nome || item.nome.toLowerCase().includes(contractFilters.nome.toLowerCase())) &&
        (!contractFilters?.tipo || item.tipo.toLowerCase().includes(contractFilters.tipo.toLowerCase())) &&
        (!contractFilters?.versao || item.versao.toLowerCase().includes(contractFilters.versao.toLowerCase())) &&
        (!contractFilters?.ambito || item.ambito.toLowerCase().includes(contractFilters.ambito.toLowerCase()))
      );
    }));
  }, [contractFilters])

  return (
    <div>
      {ambito && <h1>Contrato {ambito}</h1>}
      <h2>Lista de Claúsulas</h2>
      <button onClick={setAllItemsChecked} style={{float: 'left'}}>Select all</button>

      {/* Main Table */}
      <table>
        <thead>
          <tr>
            <th>Selecionar</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Versão</th>
            <th>Ambito</th>
            <th>Ordem</th>
          </tr>
        </thead>
        <tbody>
          {filteredClauses.length > 0 ? (
            filteredClauses.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.tipo}</td>
              <td>{item.versao}</td>
              <td>{item.ambito}</td>
              <td>{item.ordem}</td>
              <td><button onClick={() => {toggleEditClauseModal(); setEditClauseModalData(item)}}><FaPen />Editar texto da cláusula</button></td>
              <td><button onClick={() => toggleReplaceVariablesModal(item)}>< MdFindReplace />Replace variables Modal</button></td>
              
            </tr>
          ))) :
          (<tr>
            <td colSpan="6">No results found</td>
          </tr>)
          }
        </tbody>
      </table>

      <EditClauseModal id={selectedClause.id} nome={selectedClause.nome} versao={ selectedClause.versao} ambito={selectedClause.ambito} ordem={selectedClause.ordem} text={selectedClause.texto} closeModal={toggleEditClauseModal} isOpen={isEditModalOpen}/>
      <ReplaceVariablesModal id={selectedClause.id} nome={selectedClause.nome} versao={ selectedClause.versao} ambito={selectedClause.ambito} ordem={selectedClause.ordem} closeModal={toggleReplaceVariablesModal} isOpen={isReplaceVariablesModalOpen}/>
      
      <h3>Cláusulas selecionadas</h3>

      {/* Checked Items Table */}
      {Object.values(checkedItems).some((isChecked) => isChecked) ? (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Versão</th>
              <th>Âmbito</th>
              <th>Ordem</th>
            </tr>
          </thead>
          <tbody>
            {clauses
              .filter((item) => checkedItems[item.id])
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.tipo}</td>
                  <td>{item.versao}</td>
                  <td>{item.ambito}</td>
                  <td>{item.ordem}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma cláusula selecionada</p>
      )}

    {false && <GenerateWord clauses=
            {clauses
              .filter((item) => checkedItems[item.id])}/>}
     
      {Object.values(checkedItems).some((isChecked) => isChecked) ? (
        <ClauseEditor clauses={clauses
          .filter((item) => checkedItems[item.id])}/>
      ) : (true)}
    </div>
  );


}; export default ClausesList;
