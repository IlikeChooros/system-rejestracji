import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Home from './pages/Home';

function App() {
  return (
    <Routes>
						<Route
							path=""
							element={<Home />}
						/>

            <Route
              path="*"
              element={<div>404 Nie znaleziono.</div>}
            />
    </Routes>
  );
}

export default App;
