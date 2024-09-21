// src/components/Login.jsx
import React from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "", // Cambiado de username a email
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Debes ingresar un email válido")
        .required("El correo electrónico es requerido"),
      password: Yup.string().required("La contraseña es requerida"),
    }),
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password); // Usa email
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        formik.setFieldError(
          "password",
          "Correo electrónico o contraseña incorrectos"
        );
      }
    },
  });

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
                label="Correo Electrónico"
                name="email" // Cambiado a email
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
    </Box>
  );
};

export default Login;
