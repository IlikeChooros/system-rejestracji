import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import ThankYouPage from './pages/ThankYouPage';
import { AlertMessageProvider } from './providers/AlertMessage';
import Manage from './pages/Manage';
import { ErrorPage } from './pages/Error';

function App() {
  return(
    <Routes>
						<Route
							path=""
							element={
                <AlertMessageProvider>
                  <Home />
                </AlertMessageProvider>
              }
						/>

            <Route
              path="thank-you"
              element={<ThankYouPage />}
            />

            <Route
              path="manage/:id"
              element={<AlertMessageProvider><Manage /></AlertMessageProvider>}
            />
            <Route
              path="*"
              element={<ErrorPage />}
            />
    </Routes>
  )
}

export default App;
