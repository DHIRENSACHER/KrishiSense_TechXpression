import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Schemes from './pages/Schemes';
import Signup from './pages/Signup';
import Predict from './pages/Predict';
import CropYield from './pages/CropYield';
import SchemePredictor from './pages/SchemePredictor';
import Irrigation from './pages/Irrigation';
import Market from './pages/Market';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/schemes" element={<Schemes />} />
            
            {/* ML Model Routes */}
            <Route path="/predict" element={<Predict />} />
            <Route path="/crop-yield" element={<CropYield />} />
            <Route path="/scheme-predictor" element={<SchemePredictor />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/market" element={<Market />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

