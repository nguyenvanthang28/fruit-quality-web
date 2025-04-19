import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/login.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 2
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4
          }}
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ 
              mt: 3,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Login
          </Button>

          <Typography 
            sx={{ 
              mt: 3, 
              textAlign: 'center'
            }}
          >
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#1976d2', 
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up here
            </Link>
          </Typography>
        </form>
      </Box>
    </div>
  );
}