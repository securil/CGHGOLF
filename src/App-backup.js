import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './styles/App.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;