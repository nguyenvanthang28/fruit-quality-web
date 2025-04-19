
import Signup from './pages/Signup';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth-protected routes */}
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/" />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
