// src/components/DownloadUsers.jsx
import React from "react";
import { Button } from "@mui/material";
import api from "../services/api";

const DownloadUsers = () => {
  const handleDownload = async () => {
    try {
      const response = await api.downloadUsers();
      const blob = new Blob([response.data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "usuarios.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la tabla de usuarios:", error);
      alert("Error al descargar la tabla de usuarios");
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleDownload}>
      Descargar Tabla de Usuarios
    </Button>
  );
};

export default DownloadUsers;
