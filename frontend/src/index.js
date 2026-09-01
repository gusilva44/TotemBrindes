import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/home';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
)