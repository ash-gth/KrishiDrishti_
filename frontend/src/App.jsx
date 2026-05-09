import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detect from './pages/Detect';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import About from './pages/About';

// Inject @keyframes spin globally (framer-motion doesn't include it)
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#052e16',
              color: '#e2f5e8',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '0.75rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#021a0d' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#021a0d' } },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/detect"       element={<Detect />} />
          <Route path="/history"      element={<History />} />
          <Route path="/history/:id"  element={<HistoryDetail />} />
          <Route path="/about"        element={<About />} />
          {/* 404 */}
          <Route path="*" element={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', paddingTop: '80px' }}>
              <div style={{ fontSize: '5rem' }}>🌿</div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#4ade80' }}>404 — Page Not Found</h1>
              <a href="/" style={{ color: 'rgba(226,245,232,0.6)', textDecoration: 'none' }}>← Back to Home</a>
            </div>
          } />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
