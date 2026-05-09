import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scan, GitBranch, Leaf, Database, Cpu, Code2, Shield, Zap } from 'lucide-react';
import Footer from '../components/Footer';

const techStack = [
  { icon: Code2, name: 'React + Vite', desc: 'Lightning-fast frontend framework', color: '#61dbfb' },
  { icon: Zap, name: 'FastAPI', desc: 'High-performance Python backend', color: '#009485' },
  { icon: Database, name: 'MongoDB', desc: 'Flexible NoSQL data storage', color: '#4db33d' },
  { icon: Cpu, name: 'TensorFlow', desc: 'Deep learning model inference', color: '#ff6f00' },
  { icon: Shield, name: 'Pillow + OpenCV', desc: 'Image processing pipeline', color: '#a78bfa' },
  { icon: Leaf, name: 'Transfer Learning', desc: 'MobileNetV2-based architecture', color: '#22c55e' },
];

const team = [
  { name: 'AI Research Team', role: 'Model Training & Accuracy', emoji: '🧪' },
  { name: 'Backend Engineers', role: 'FastAPI + Database Design', emoji: '⚙️' },
  { name: 'Frontend Designers', role: 'React UI/UX Development', emoji: '🎨' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <main className="page-wrapper" style={{ background: '#021a0d', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(22,163,74,0.1) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(74,222,128,0.08)',
          padding: '5rem 1.5rem 4rem', textAlign: 'center',
        }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌾</div>
            <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>About KrishiDrishti</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              AI for <span className="gradient-text">Agriculture</span>,<br />Built for Farmers
            </h1>
            <p style={{ color: 'rgba(226,245,232,0.65)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.8 }}>
              KrishiDrishti (कृषि दृष्टि — "Agricultural Vision") is an AI-powered platform that enables farmers and agronomists to instantly detect plant diseases using just a smartphone photo. No expertise required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/detect')} className="btn-primary">
                <Scan size={18} /> Try Detection
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <GitBranch size={18} /> View on GitHub
              </a>
            </div>
          </motion.div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass"
            style={{ padding: '3rem', marginBottom: '4rem', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Our <span className="gradient-text">Mission</span></h2>
            <p style={{ color: 'rgba(226,245,232,0.7)', fontSize: '1.1rem', lineHeight: 1.9, maxWidth: '700px', margin: '0 auto' }}>
              Every year, plant diseases destroy up to <strong style={{ color: '#fbbf24' }}>40% of global food crops</strong>, costing farmers trillions. KrishiDrishti democratizes access to expert plant pathology knowledge by turning a simple smartphone camera into a powerful disease detection tool — free, fast, and accurate.
            </p>
          </motion.div>

          {/* Tech Stack */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>⚡ Technology</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Built With <span className="gradient-text">Modern Tech</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {techStack.map(({ icon: Icon, name, desc, color }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card"
                  style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '42px', height: '42px', flexShrink: 0, borderRadius: '0.65rem',
                    background: `${color}18`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#e2f5e8', marginBottom: '0.25rem' }}>{name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(226,245,232,0.5)' }}>{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>👥 Team</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Built By <span className="gradient-text">Innovators</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {team.map(({ name, role, emoji }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card"
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{emoji}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2f5e8', marginBottom: '0.4rem' }}>{name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(226,245,232,0.5)' }}>{role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
