// src/components/Login.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Función para encontrar el correo electrónico por nombre de usuario en Firestore
  const findEmailByUsername = async (username) => {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.email; // Devuelve el correo electrónico correspondiente al nombre de usuario
    } else {
      return null; // Si no se encuentra el nombre de usuario
    }
  };

  const formik = useFormik({
    initialValues: {
      identifier: "", // Este campo puede ser el nombre de usuario o el correo electrónico
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required(
        "El correo o nombre de usuario es requerido"
      ),
      password: Yup.string().required("La contraseña es requerida"),
    }),
    onSubmit: async (values) => {
      try {
        let email = values.identifier;

        // Verificar si el campo "identifier" parece un correo electrónico
        const isEmail = /\S+@\S+\.\S+/.test(email);

        // Si no es un correo electrónico, asumimos que es un nombre de usuario y lo buscamos en Firestore
        if (!isEmail) {
          email = await findEmailByUsername(values.identifier);
          if (!email) {
            setSnackbarMessage("Nombre de usuario no encontrado");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
          }
        }

        // Iniciar sesión con Firebase Authentication usando el correo electrónico encontrado
        await signInWithEmailAndPassword(auth, email, values.password);
        setSnackbarMessage("Inicio de sesión exitoso");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirigir al dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setSnackbarMessage("Correo electrónico o contraseña incorrectos");
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}>
          <Typography variant="h5">Iniciar Sesión</Typography>
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              fullWidth
              margin="normal">
              <TextField
                required
                label="Correo o Nombre de Usuario"
                name="identifier"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.identifier}
                error={
                  formik.touched.identifier && Boolean(formik.errors.identifier)
                }
                helperText={
                  formik.touched.identifier && formik.errors.identifier
                }
                variant="outlined"
              />
            </FormControl>
            <FormControl
              fullWidth
              margin="normal">
              <TextField
                required
                label="Contraseña"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Iniciar Sesión
            </Button>
          </form>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </Typography>
        </Box>
      </Container>

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
    </Box>
  );
};

export default Login;
