// packages/frontend/src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // NEW Imports for Router

// Context and Admin Components
import { AuthProvider } from './context/AuthContext'; // NEW: Import AuthProvider
import AdminDashboard from './pages/AdminDashboard'; // NEW: Import AdminDashboard

// Existing Portfolio Components (assuming Navbar and Hero are NOT lazy-loaded)
import Navbar from './components/Navbar';
import Hero from './sections/Hero';

// Lazy load the other sections and the Footer
const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// NEW: A component to render all portfolio sections for the home page route
const PortfolioHomePage: React.FC = () => (
  <>
    <Hero /> {/* Hero is typically always loaded as it's the first thing users see */}

    {/* Use Suspense for each lazy-loaded section */}
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading About section...</div>}>
      <About />
    </Suspense>

    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading Skills section...</div>}>
      <Skills />
    </Suspense>

    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading Projects section...</div>}>
      <Projects />
    </Suspense>

    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading Contact section...</div>}>
      <Contact />
    </Suspense>
  </>
);

const App: React.FC = () => {
  return (
    <AuthProvider> {/* <-- NEW: Wrap the entire application with AuthProvider */}
      <Router> {/* <-- NEW: Wrap the routing logic with BrowserRouter */}
        <div className="relative">
          <Navbar /> {/* Navbar stays here if it's always present on all pages */}

          <main>
            <Routes> {/* <-- NEW: Define your application's routes */}
              {/* Route for the main portfolio home page */}
              <Route path="/" element={<PortfolioHomePage />} />

              {/* Route for the admin dashboard */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Add more routes here if you have other distinct pages */}
            </Routes>
          </main>

          {/* Footer stays here if it's always present on all pages */}
          <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center text-xl text-gray-400">Loading Footer...</div>}>
            <Footer />
          </Suspense>
        </div>
      </Router> {/* <-- NEW: Close BrowserRouter */}
    </AuthProvider> // <-- NEW: Close AuthProvider
  );
};

export default App;