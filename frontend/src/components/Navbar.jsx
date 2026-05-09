import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, History, Info, Scan, Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Leaf },
  { path: '/detect', label: 'Detect', icon: Scan },
  { path: '/history', label: 'History', icon: History },
  { path: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '38px', height: '38px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(34,197,94,0.4)',
              }}>
                <Leaf size={20} color="#021a0d" strokeWidth={2.5} />
              </div>
              <div>
                <span style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                  fontSize: '1.25rem', color: '#4ade80', letterSpacing: '-0.02em',
                }}>
                  Krishi
                </span>
                <span style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                  fontSize: '1.25rem', color: '#e2f5e8', letterSpacing: '-0.02em',
                }}>
                  Drishti
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              className="hidden md:flex">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link key={path} to={path} style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.65rem',
                    textDecoration: 'none',
                    fontSize: '0.9rem', fontWeight: active ? 600 : 500,
                    color: active ? '#4ade80' : 'rgba(226,245,232,0.7)',
                    background: active ? 'rgba(74,222,128,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#e2f5e8'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(226,245,232,0.7)'; }}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/detect')}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem', display: 'none' }}
                id="nav-cta-desktop"
              >
                <Zap size={15} />
                Analyze Now
              </button>
              <button
                className="md:hidden"
                onClick={() => setMobileOpen(o => !o)}
                style={{
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  borderRadius: '0.65rem',
                  padding: '0.5rem',
                  color: '#4ade80',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 999,
              background: 'rgba(2, 26, 13, 0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(74,222,128,0.15)',
              padding: '1rem 1.5rem 1.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link key={path} to={path} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    fontSize: '1rem', fontWeight: active ? 600 : 500,
                    color: active ? '#4ade80' : 'rgba(226,245,232,0.8)',
                    background: active ? 'rgba(74,222,128,0.1)' : 'transparent',
                  }}>
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
              <button onClick={() => navigate('/detect')} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                <Zap size={16} /> Analyze Plant Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
