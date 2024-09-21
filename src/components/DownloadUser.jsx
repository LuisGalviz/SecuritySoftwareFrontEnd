// src/components/DownloadUsers.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const DownloadUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleDownload = () => {
    const usersText = users.map((user) => JSON.stringify(user)).join("\n");
    const blob = new Blob([usersText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.txt";
    a.click();
    URL.revokeObjectURL(url);
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
