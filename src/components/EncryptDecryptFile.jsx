// src/components/EncryptDecryptFile.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import api from '../services/api';

const EncryptDecryptFile = () => {
    const [file, setFile] = useState(null);
    const [key, setKey] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleEncrypt = async () => {
        try {
            await api.encryptFile(file, key);
            alert('Archivo cifrado con éxito');
        } catch (error) {
            console.error('Error al cifrar archivo:', error);
            alert('Error al cifrar archivo');
        }
    };

    const handleDecrypt = async () => {
        try {
            await api.decryptFile(file, key);
            alert('Archivo descifrado con éxito');
        } catch (error) {
            console.error('Error al descifrar archivo:', error);
            alert('Error al descifrar archivo');
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <TextField
                    type="file"
                    onChange={handleFileChange}
                    sx={{ mt: 2, mb: 2 }}
                />
                <TextField
                    label="Llave"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                />
                <Button variant="contained" onClick={handleEncrypt} sx={{ mt: 2 }}>
                    Cifrar Archivo
                </Button>
                <Button variant="contained" onClick={handleDecrypt} sx={{ mt: 2 }}>
                    Descifrar Archivo
                </Button>
            </Box>
        </Container>
    );
};

export default EncryptDecryptFile;
