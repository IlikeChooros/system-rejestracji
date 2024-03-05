import React from 'react';
import { Routes, Route, Navigate, useNavigate} from 'react-router-dom';

import Home from './pages/Home';
import ThankYouPage from './pages/ThankYouPage';
import { AlertMessageProvider } from './providers/AlertMessage';
import Manage from './pages/Manage';
import { ErrorPage } from './pages/Error';
import { AuthProvider, useAuth } from './auth.tsx';
import Login from './pages/admin/Login';
import { ProtectedRoute } from './providers/AuthRoutes.tsx';
import Admin from './pages/admin/Admin.js';
import MainFramework from './components/MainFramework.js';
import FullFramework from './components/FullFramework.js';
import { Button, IconButton } from '@mui/material';
import GoBackIcon from '@mui/icons-material/ArrowBackIosNew';
import { registerFormsWithDelete } from './datastructures/input-objects.ts';

function App() {
  return(
    <AuthProvider>
      <BareApp />
    </AuthProvider>
  )
}

function BareApp(){

  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  return(
    <Routes>
						<Route
							path=""
							element={
                <Navigate to={isAuthenticated ? '/admin' : '/register'} />
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
                  <MainFramework>
                    <Manage />
                  </MainFramework>
                </AlertMessageProvider>
              }
            />

            <Route 
              path="admin/manage/:id"
              element={
                <ProtectedRoute>
                  <AlertMessageProvider>
                    <FullFramework>
                      <Manage 
                        to='/admin'
                        forms={registerFormsWithDelete}
                        action={
                          <Button
                            onClick={() => navigate(-1)}
                            endIcon={
                              <GoBackIcon />
                            }
                          >
                            Powrót
                          </Button>
                        } 
                      />
                    </FullFramework>
                  </AlertMessageProvider>
                </ProtectedRoute>
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
