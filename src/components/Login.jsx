// src/components/Login.jsx
import React from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("El nombre de usuario es requerido"),
      password: Yup.string().required("La contraseña es requerida"),
    }),
    onSubmit: async (values) => {
      try {
        await api.login(values);
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        formik.setFieldError(
          "password",
          "Nombre de usuario o contraseña incorrectos"
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
                label="Nombre de Usuario"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
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
