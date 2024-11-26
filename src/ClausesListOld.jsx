import React, { useState } from 'react';

const ClausesList = ({contractClauses}) => {
  const [clauses, setClauses] = useState(contractClauses)

  // State to store checkbox states
  const [checkedItems, setCheckedItems] = useState(
    contractClauses.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setCheckedItems({
      ...checkedItems,
      [id]: !checkedItems[id],
    });
  };

  return (
    <div>
      <h2>List of Elements</h2>
        {clauses.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={checkedItems[item.id]}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <strong>{item.nome}</strong>
          </li>
        ))}

      <h3>Checked Items:</h3>
      <ul>
        {clauses
          .filter((item) => checkedItems[item.id])
          .map((item) => (
            <li key={item.id}>
              <strong>{item.nome}</strong>
            </li>
          ))}
      </ul>

      
    </div>
  );
};

export default ClausesList;
