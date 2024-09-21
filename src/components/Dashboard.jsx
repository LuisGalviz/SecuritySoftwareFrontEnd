// src/components/Dashboard.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DownloadUsers from "./DownloadUser";
import EncryptDecryptFile from "./EncryptDecryptFile";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Importa la función signOut
import { auth } from "../services/firebase"; // Importa la instancia de autenticación de Firebase

const drawerWidth = 240; // Ancho del Drawer

const Dashboard = () => {
  // Estado del Drawer y la opción seleccionada, por defecto abiertos y con la primera opción seleccionada
  const [drawerOpen, setDrawerOpen] = useState(true); // Drawer abierto por defecto
  const [selectedOption, setSelectedOption] = useState("download"); // Primera opción seleccionada por defecto
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setDrawerOpen(false); // Si quieres que el Drawer se cierre al seleccionar una opción, puedes dejarlo. De lo contrario, elimina esta línea.
  };

  // Función para manejar el cierre de sesión usando Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra la sesión del usuario en Firebase
      navigate("/"); // Redirige al inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}>
        <Toolbar />{" "}
        {/* Espacio para que el Drawer no se superponga al AppBar */}
        <List>
          <ListItem
            button
            onClick={() => handleMenuClick("download")}
            selected={selectedOption === "download"}>
            <ListItemText primary="Descargar Usuarios" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleMenuClick("encrypt")}
            selected={selectedOption === "encrypt"}>
            <ListItemText primary="Cifrar/Descifrar Archivo" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerOpen ? `${drawerWidth}px` : 0, // Ajusta el contenido al ancho del Drawer
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}>
        <Toolbar />{" "}
        {/* Espacio para que el contenido no se superponga al AppBar */}
        {selectedOption === "download" && (
          <Box>
            <Typography variant="h6">Descarga de Usuarios</Typography>
            <DownloadUsers />
          </Box>
        )}
        {selectedOption === "encrypt" && (
          <Box>
            <Typography variant="h6">Cifrar/Descifrar Archivo</Typography>
            <EncryptDecryptFile />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
