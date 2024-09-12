# Secure Web Application - Frontend

## Project Overview
This repository contains the frontend of a secure web application built using React. The application implements OWASP best practices and uses cryptographic libraries for enhanced security. It allows users to register, log in with secure passwords, and offers features such as secure file encryption and downloading user information in text format.

## Features
- **User Authentication**: Registration and login with password rules (min 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character).
- **Download User Data**: Provides an option to download user data in text format for verification purposes.
- **AES Encryption/Decryption**: Users can upload files and encrypt/decrypt them using AES with a provided key.
- **Logout**: Secure logout functionality to end the session.

## Tech Stack
- **React**: JavaScript library for building user interfaces.
- **Axios**: To handle API requests to the backend.
- **Styled Components**: For styling React components.
- **React Router**: For routing and navigation.
- **OWASP ZAP**: Ensures no high or medium vulnerabilities exist in the application.
