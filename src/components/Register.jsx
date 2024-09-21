// src/components/Register.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material"; // Importa Snackbar y Alert
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Firestore para buscar username
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; // Para el hash SHA-1

const Register = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severidad del Snackbar (success, error, etc.)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true); // Estado para validar el nombre de usuario

  // Función para verificar si el username es único
  const checkUsernameExists = async (username) => {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Devuelve true si ya existe un documento con ese username
  };

  // Manejo del cambio en el campo de nombre de usuario para validación en tiempo real
  const handleUsernameChange = async (e) => {
    formik.handleChange(e);
    const username = e.target.value;
    if (username) {
      const usernameExists = await checkUsernameExists(username);
      setIsUsernameAvailable(!usernameExists); // Si el username existe, no está disponible
      if (usernameExists) {
        setSnackbarMessage("El nombre de usuario ya está en uso.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "", // Correo electrónico del usuario
      username: "", // Nombre de usuario (login)
      password: "",
      secondPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
      username: Yup.string().required("El nombre de usuario es requerido"),
      firstName: Yup.string().required("El nombre es requerido"),
      lastName: Yup.string().required("El apellido es requerido"),
      password: Yup.string()
        .required("La contraseña es requerida")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
          "La contraseña debe tener al menos 8 caracteres, incluyendo un número, una letra mayúscula, una letra minúscula y un carácter especial."
        ),
      secondPassword: Yup.string()
        .required("Debes confirmar la contraseña")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
    }),
    onSubmit: async (values) => {
      try {
        // Si el nombre de usuario ya existe, detener el registro
        if (!isUsernameAvailable) {
          setSnackbarMessage("El nombre de usuario ya está en uso.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Crear el hash SHA-1 de la contraseña
        const passwordHash = CryptoJS.SHA1(values.password).toString();

        // Registrar usuario en Firebase Authentication con el correo y la contraseña original
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email, // El correo electrónico para Firebase Authentication
          values.password // Contraseña para Firebase Authentication
        );
        const user = userCredential.user;

        // Guardar el usuario en Firestore con la información adicional y el hash de la contraseña
        await setDoc(doc(db, "users", user.uid), {
          username: values.username, // Nombre de usuario (login)
          firstName: values.firstName, // Nombre
          lastName: values.lastName, // Apellido
          email: values.email, // Almacenar el correo en Firestore también si es necesario
          passwordHash: passwordHash, // Guardar la contraseña como hash SHA-1
        });

        // Mostrar Snackbar de éxito
        setSnackbarMessage("Usuario registrado con éxito.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirigir al dashboard después de unos segundos
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        setSnackbarMessage("Error al registrar usuario. Inténtalo nuevamente.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
  });

  // Función para cerrar el Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}>
        <Typography variant="h5">Registro</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Correo Electrónico"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nombre de Usuario (login)"
            name="username"
            onChange={handleUsernameChange} // Verificar en tiempo real si el nombre de usuario está en uso
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={
              !isUsernameAvailable ||
              (formik.touched.username && Boolean(formik.errors.username))
            }
            helperText={
              !isUsernameAvailable
                ? "El nombre de usuario ya está en uso"
                : formik.touched.username && formik.errors.username
            }
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nombre"
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Apellido"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Repetir Contraseña"
            type="password"
            name="secondPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.secondPassword}
            error={
              formik.touched.secondPassword &&
              Boolean(formik.errors.secondPassword)
            }
            helperText={
              formik.touched.secondPassword && formik.errors.secondPassword
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Registrar
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            ¿Tienes una cuenta? <Link to="/">Iniciar Sesión</Link>
          </Typography>
        </Box>
      </Box>

      {/* Snackbar para mostrar los mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Centrar el Snackbar
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
