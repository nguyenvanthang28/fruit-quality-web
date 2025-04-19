import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, Input } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import backgroundImage from '../assets/images/signin.jpg';

const CLASS_LABELS = {
  0: 'Apple (Bad)',
  1: 'Apple (Good)',
  2: 'Apple (Mixed)',
  3: 'Banana (Bad)',
  4: 'Banana (Good)',
  5: 'Banana (Mixed)',
  6: 'Guava (Bad)',
  7: 'Guava (Good)',
  8: 'Guava (Mixed)',
  9: 'Lemon (Mixed)',
  10: 'Lime (Bad)',
  11: 'Lime (Good)',
  12: 'Orange (Bad)',
  13: 'Orange (Good)',
  14: 'Orange (Mixed)',
  15: 'Pomegranate (Bad)',
  16: 'Pomegranate (Good)',
  17: 'Pomegranate (Mixed)'
};

export default function Home() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [selectedModel, setSelectedModel] = useState('MobileNetV2');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowPrediction(false);
      setPredictionResult(null);
      setPreviewUrl(null);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setShowPrediction(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPredictionResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile || !user) return;

    setIsPredicting(true);
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('model_type', selectedModel === 'MobileNetV2' ? 'mobilenet' : 'inception');

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setPredictionResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionResult({
        error: error.response?.data?.error || 'Prediction failed. Please try again.'
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleCancel = () => {
    setShowPrediction(false);
    setPredictionResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
      }}>
        <Toolbar>
          <Typography 
            variant="h4" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              color: 'white',
              textDecoration: 'none',
              '&:hover': { 
                color: '#f5f5f5',
                cursor: 'pointer'
              }
            }}
          >
            FRUIT QUALITY
          </Typography>
          
          {user ? (
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: '#f5f5f5',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
              onClick={handleLogout}
            >
              LOG OUT
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button component={Link} to="/signup" variant="contained" sx={{ 
                backgroundColor: 'white',
                color: 'black',
                '&:hover': { 
                  backgroundColor: '#f5f5f5',
                  boxShadow: 2,
                }
              }}>
                Sign Up
              </Button>
              <Button component={Link} to="/login" variant="outlined" sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: '#f5f5f5',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}>
                Log In
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <div style={{
        flexGrow: 1,
        paddingTop: '64px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {!user || !showPrediction ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            padding: '40px 20px',
            minHeight: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%'
          }}>
            <Typography variant="h2" gutterBottom sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Fruit Quality Detection
            </Typography>
            <Typography variant="h5" sx={{ 
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              Using Deep Learning Technology
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: 'white',
                color: 'black',
                '&:hover': { 
                  backgroundColor: '#f5f5f5',
                  transform: 'scale(1.05)'
                },
                transition: 'transform 0.3s ease'
              }}
              onClick={handleGetStarted}
            >
              GET STARTED
            </Button>
          </div>
        ) : (
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            width: '90%',
            maxWidth: '600px',
            margin: '64px auto 0',
            textAlign: 'center',
            overflowY: 'auto',
            maxHeight: '90vh'
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              mb: 3,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              Fruit Quality Prediction
            </Typography>

            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              sx={{ 
                mb: 3, 
                width: '100%',
                '& .MuiSelect-select': {
                  padding: '12px 32px 12px 14px'
                }
              }}
            >
              <MenuItem value="MobileNetV2">MobileNetV2</MenuItem>
              <MenuItem value="InceptionResNetV2">InceptionResNetV2</MenuItem>
            </Select>

            <Input
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={handleFileUpload}
              sx={{ display: 'none' }}
              id="file-upload"
              key={previewUrl ? 'file-selected' : 'file-empty'}
            />
            <label htmlFor="file-upload">
              <Button 
                variant="contained" 
                component="span"
                sx={{ 
                  mb: 2,
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                {selectedFile ? selectedFile.name : 'UPLOAD FRUIT IMAGE'}
              </Button>
            </label>

            {previewUrl && (
              <Box sx={{ 
                mt: 2,
                mb: 3,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}

            {predictionResult && (
              <Box sx={{ 
                mt: 2,
                p: 3,
                backgroundColor: predictionResult.error ? '#ffebee' : '#e8f5e9',
                borderRadius: 2,
                textAlign: 'left',
                wordBreak: 'break-word',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {predictionResult.error ? (
                  <Typography 
                    color="error"
                    sx={{ fontSize: '1rem' }}
                  >
                    ⚠️ {predictionResult.error}
                  </Typography>
                ) : (
                  <>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        mb: 1.5
                      }}
                    >
                      🍎 Prediction Result
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '1rem',
                        mb: 1
                      }}
                    >
                      <strong>Quality:</strong> {CLASS_LABELS[predictionResult.prediction] || 'Unknown'}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '1rem',
                        color: '#2e7d32'
                      }}
                    >
                      <strong>Confidence:</strong> {(predictionResult.confidence * 100).toFixed(2)}%
                    </Typography>
                  </>
                )}
              </Box>
            )}

            <Box sx={{ 
              mt: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center'
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ 
                  minWidth: '200px',
                  py: 1.5,
                  fontSize: '1rem',
                  order: { xs: 1, sm: 0 }
                }}
                disabled={!selectedFile || isPredicting}
                onClick={handlePredict}
              >
                {isPredicting ? (
                  <span>🔍 ANALYZING...</span>
                ) : (
                  <span>📸 PREDICT QUALITY</span>
                )}
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  minWidth: '200px',
                  py: 1.5,
                  fontSize: '1rem',
                  order: { xs: 0, sm: 1 }
                }}
                onClick={handleCancel}
              >
                ❌ CANCEL
              </Button>
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
}