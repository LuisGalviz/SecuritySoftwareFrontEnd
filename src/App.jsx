// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EncryptDecryptFile from "./components/EncryptDecryptFile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/encrypt-decrypt"
          element={<EncryptDecryptFile />}
        />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;

