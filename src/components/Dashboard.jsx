// src/components/Dashboard.jsx
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleDownloadUsers = async () => {
        try {
            const usersData = await api.downloadUsers();
            const blob = new Blob([usersData], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'users.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar usuarios:', error);
            alert('Error al descargar usuarios');
        }
    };

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Typography variant="h5">Panel de Usuario</Typography>
                <Button variant="contained" onClick={handleDownloadUsers} sx={{ mt: 2 }}>
                    Descargar Tabla de Usuarios
                </Button>
                <Button variant="contained" onClick={() => navigate('/encrypt-decrypt')} sx={{ mt: 2 }}>
                    Cifrar/Descifrar Archivo
                </Button>
                <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
                    Cerrar Sesión
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;
