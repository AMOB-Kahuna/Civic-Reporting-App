import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Terms from './pages/Terms';
import MakeReport from './pages/MakeReport';
import Reports from './pages/Reports';
import Report from './pages/Report';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="make-report" element={<MakeReport />} />
          <Route path="reports" element={<Reports />} />
          <Route path="terms" element={<Terms />} />
          <Route path="report/:id" element={<Report />} />
          <Route path="login" element={<Login />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
