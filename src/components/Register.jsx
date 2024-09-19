// src/components/Register.jsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de la contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, incluyendo un número, una letra mayúscula, una letra minúscula y un carácter especial."
      );
      return;
    }
    try {
      await api.register(formData);
      alert("Usuario registrado con éxito");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}>
        <Typography variant="h5">Registro</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre de Usuario"
            name="username"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre"
            name="firstName"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Apellido"
            name="lastName"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Registrar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
