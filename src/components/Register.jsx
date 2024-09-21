// src/components/Register.jsx
import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js"; // Para el hash SHA-1
import { useNavigate } from "react-router-dom";

const Register = () => { 

  const navigate = useNavigate();

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

        alert("Usuario registrado con éxito");
        navigate("/"); // Redirigir al inicio de sesión
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("Error al registrar usuario");
      }
    },
  });

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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
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
    </Container>
  );
};

export default Register;
