// src/components/EncryptDecryptFile.jsx
import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import api from "../services/api";

const EncryptDecryptFile = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEncrypt = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      await api.encryptFile(formData);
      alert("Archivo cifrado con éxito");
    } catch (error) {
      console.error("Error al cifrar archivo:", error);
      alert("Error al cifrar archivo");
    }
  };

  const handleDecrypt = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      await api.decryptFile(formData);
      alert("Archivo descifrado con éxito");
    } catch (error) {
      console.error("Error al descifrar archivo:", error);
      alert("Error al descifrar archivo");
    }
  };

  return (
    <Box>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <TextField
        label="Clave AES"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleEncrypt}
        sx={{ mt: 2 }}>
        Cifrar Archivo
      </Button>
      <Button
        variant="contained"
        onClick={handleDecrypt}
        sx={{ mt: 2, ml: 2 }}>
        Descifrar Archivo
      </Button>
    </Box>
  );
};

export default EncryptDecryptFile;
