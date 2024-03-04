import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import ThankYouPage from './pages/ThankYouPage';
import { AlertMessageProvider } from './providers/AlertMessage';
import Manage from './pages/Manage';
import { ErrorPage } from './pages/Error';
import { AuthProvider, useAuth } from './auth.tsx';
import Login from './pages/admin/Login';
import { ProtectedRoute } from './providers/AuthRoutes.tsx';
import Admin from './pages/admin/Admin.js';

function App() {
  return(
    <AuthProvider>
      <BareApp />
    </AuthProvider>
  )
}

function BareApp(){

  const {isAuthenticated} = useAuth();
  return(
    <Routes>
						<Route
							path=""
							element={
                  isAuthenticated ? <Admin /> : <Home />
              }
						/>

            <Route
              path='login'
              element={<Login />}
            />

            <Route
              path="register"
              element={
                <AlertMessageProvider>
                  <Home />
                </AlertMessageProvider>
              }
            />

            <Route
              path="manage/:id"
              element={
                <AlertMessageProvider>
                  <Manage />
                </AlertMessageProvider>
              }
            />

            <Route
              path="thank-you"
              element={<ThankYouPage />}
            />

            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AlertMessageProvider>
                    <Admin />
                  </AlertMessageProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<ErrorPage />}
            />
      </Routes>
  )
}

export default App;
