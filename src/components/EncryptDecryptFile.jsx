// src/components/EncryptDecryptFile.jsx
import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CryptoJS from "crypto-js";

const EncryptDecryptFile = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEncrypt = async () => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const fileContent = event.target.result;
      const encrypted = CryptoJS.AES.encrypt(fileContent, key).toString();
      const blob = new Blob([encrypted], { type: "text/plain" });

      const storageRef = ref(storage, `encrypted_files/${file.name}`);
      await uploadBytes(storageRef, blob);
      alert("Archivo cifrado y subido con éxito");
    };
    reader.readAsText(file);
  };

  const handleDecrypt = async () => {
    const storageRef = ref(storage, `encrypted_files/${file.name}`);
    const url = await getDownloadURL(storageRef);

    const response = await fetch(url);
    const encryptedText = await response.text();

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(
      CryptoJS.enc.Utf8
    );
    alert("Archivo descifrado: " + decrypted);
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
