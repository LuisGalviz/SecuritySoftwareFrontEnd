import React, { useState } from "react";
import { Button, TextField, Box, Snackbar, Alert } from "@mui/material";
import CryptoJS from "crypto-js";

const EncryptDecryptFile = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Manejar el cambio del archivo seleccionado
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Cifrar el archivo local y ofrecerlo para descarga
  const handleEncrypt = async () => {
    if (!file || !key) {
      setSnackbarMessage("Por favor selecciona un archivo e ingresa una clave");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileContent); // Convertir a formato de CryptoJS
      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString(); // Cifrar

      const blob = new Blob([encrypted], { type: "text/plain" });

      // Crear un enlace temporal para descargar el archivo cifrado
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${file.name}.enc`;
      link.click();

      setSnackbarMessage("Archivo cifrado y listo para descargar");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    };
    reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer para manejar binarios
  };

  // Descifrar el archivo seleccionado localmente con la clave proporcionada
  const handleDecrypt = async () => {
    if (!file || !key) {
      setSnackbarMessage(
        "Por favor selecciona un archivo cifrado e ingresa la clave"
      );
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const encryptedContent = event.target.result;

      try {
        // Descifrar el archivo con la clave proporcionada
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, key).toString(
          CryptoJS.enc.Base64
        );

        // Convertir el archivo descifrado de Base64 a formato binario para poder ser descargado
        const byteCharacters = atob(decrypted);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: file.type });

        // Crear un enlace temporal para descargar el archivo descifrado
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${file.name.replace(".enc", "")}`;
        link.click();

        setSnackbarMessage("Archivo descifrado y listo para descargar");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al descifrar el archivo:", error);
        setSnackbarMessage("Error al descifrar el archivo");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    reader.readAsText(file); // Leer el archivo cifrado como texto
  };

  // Cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      {/* Sección para seleccionar archivo y cifrar/descifrar */}
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleEncrypt}
          disabled={!file}>
          Cifrar Archivo
        </Button>
        <Button
          variant="contained"
          onClick={handleDecrypt}
          disabled={!file}>
          Descifrar Archivo
        </Button>
      </Box>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EncryptDecryptFile;
