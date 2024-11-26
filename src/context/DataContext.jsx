// src/context/DataContext.js

import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

// Create the context
const DataContext = createContext();

// Create the provider component
export function DataProvider({ children }) {
  const [clauses, setClauses] = useState([]);

  const updateRowInState = (updatedRow) => {
    setClauses((prevData) =>
      prevData.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
  };

  useEffect(() => {
    const fetchClauses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clauses");
        setClauses(response.data);
      } catch (error) {
        console.error("Error fetching clauses:", error);
      }
    };
    fetchClauses();
  }, []);

  return (
    <DataContext.Provider value={{ clauses, setClauses, updateRowInState }}>
      {children}
    </DataContext.Provider>
  );
}

// Create a custom hook for consuming the context
export function useDataContext() {
  return useContext(DataContext);
}
