import { Link } from 'react-router-dom';
import { Leaf, GitBranch, ExternalLink, Mail, Heart, Globe } from 'lucide-react';

const links = {
  Platform: [
    { label: 'Detect Disease', to: '/detect' },
    { label: 'View History', to: '/history' },
    { label: 'About', to: '/about' },
  ],
  Technology: [
    { label: 'FastAPI Backend', href: 'https://fastapi.tiangolo.com' },
    { label: 'React Frontend', href: 'https://react.dev' },
    { label: 'TensorFlow AI', href: 'https://tensorflow.org' },
  ],
};

const socials = [
  { icon: GitBranch,   href: '#', label: 'GitHub' },
  { icon: Globe,       href: '#', label: 'Website' },
  { icon: ExternalLink,href: '#', label: 'Portfolio' },
  { icon: Mail,        href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(2,13,7,0.98)', borderTop: '1px solid rgba(74,222,128,0.08)', padding: '4rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={18} color="#021a0d" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
                <span style={{ color: '#4ade80' }}>Krishi</span>
                <span style={{ color: '#e2f5e8' }}>Drishti</span>
              </span>
            </Link>
            <p style={{ color: 'rgba(226,245,232,0.5)', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: '280px', marginBottom: '1.5rem' }}>
              AI-powered plant disease detection for modern agriculture. Upload, detect, and protect your crops instantly.
            </p>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: '36px', height: '36px', borderRadius: '0.5rem',
                  background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(226,245,232,0.5)', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4ade80'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,245,232,0.5)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.12)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {group}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {items.map(({ label, to, href }) => (
                  <li key={label} style={{ marginBottom: '0.6rem' }}>
                    {to
                      ? <Link to={to} style={{ color: 'rgba(226,245,232,0.55)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2f5e8'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,245,232,0.55)'}
                        >{label}</Link>
                      : <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(226,245,232,0.55)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e2f5e8'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,245,232,0.55)'}
                        >{label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(226,245,232,0.35)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} KrishiDrishti. Built for farmers, by innovators.
          </p>
          <p style={{ color: 'rgba(226,245,232,0.35)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Made with <Heart size={12} color="#ef4444" fill="#ef4444" /> using React & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
