import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/signup.jpg';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
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
          Sign Up
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

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>

          <Typography 
            sx={{ 
              mt: 3, 
              textAlign: 'center'
            }}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#1976d2', 
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Log in here
            </Link>
          </Typography>
        </form>
      </Box>
    </div>
  );
}