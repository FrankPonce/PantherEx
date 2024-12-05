import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItemListPage from './pages/ItemListPage';
import CreateListingPage from './pages/CreateListingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import UserProfilePage from './pages/UserProfilePage';
import ItemDetailPage from './pages/ItemDetailPage'; // Import the ItemDetailPage component

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Update the auth state based on the presence of a token in localStorage
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AuthPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ItemListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id" // Add this route for item details
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/users/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
