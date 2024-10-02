import React from 'react';
import { Navigate } from 'react-router-dom';

function Protected({ children }) {
  const isAuthenticated = localStorage.getItem("user-info") !== null; // Simple check

  return (
    <>
      {isAuthenticated ? children : <Navigate to="/login" />} {/* Redirect if not authenticated */}
    </>
  );
}

export default Protected;
