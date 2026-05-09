import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, ChevronRight, Leaf, Shield, Zap, BarChart2, CheckCircle } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Plants Analyzed' },
  { value: '38',   label: 'Diseases Detected' },
  { value: '97%',  label: 'Accuracy Rate' },
  { value: '< 3s', label: 'Result Time' },
];

const features = [
  { icon: Zap,       color: '#fbbf24', label: 'Instant AI Analysis',     desc: 'Results in under 3 seconds' },
  { icon: Shield,    color: '#22c55e', label: 'Expert Recommendations',  desc: 'Actionable treatment plans' },
  { icon: BarChart2, color: '#818cf8', label: 'History Tracking',        desc: 'Monitor crop health over time' },
  { icon: Leaf,      color: '#a3e635', label: '38 Disease Types',        desc: 'Covering major crop diseases' },
];

/* ── Floating background leaves ─────────────────────────────────────── */
function FloatingLeaves() {
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 11}%`,
    delay: `${i * 1.2}s`,
    duration: `${8 + (i % 4) * 2}s`,
    size: 12 + (i % 3) * 8,
    opacity: 0.06 + (i % 3) * 0.03,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {leaves.map(l => (
        <div key={l.id} style={{
          position: 'absolute', left: l.left, top: '-20px',
          fontSize: `${l.size}px`, opacity: l.opacity,
          animation: `leaf-fall ${l.duration} linear ${l.delay} infinite`,
        }}>🌿</div>
      ))}
    </div>
  );
}

/* ── Badge pill shown in the hero card ──────────────────────────────── */
function FloatingBadge({ icon: Icon, color, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: 'rgba(2,26,13,0.92)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '0.75rem', padding: '0.55rem 1rem',
        fontSize: '0.8rem', fontWeight: 600, color: '#e2f5e8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={14} color={color} />
      {label}
    </motion.div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  return (
    /* ── Outer section: NO overflow:hidden so badges aren't clipped ── */
    <section className="hero-bg grid-pattern" style={{ position: 'relative', paddingTop: '5rem' }}>
      <FloatingLeaves />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '5%', left: '15%', zIndex: 0,
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%', zIndex: 0,
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Main hero content ─────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

          {/* ── LEFT: Text ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="section-tag">
              <Leaf size={12} />
              AI-Powered Plant Disease Detection
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Detect Plant{' '}
              <span className="gradient-text">Diseases</span>
              <br />
              Before They Spread
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgba(226,245,232,0.7)', lineHeight: 1.85, marginBottom: '2.5rem', maxWidth: '470px' }}>
              Upload a leaf photo and get an instant AI diagnosis with expert-level treatment recommendations. Protect your crops with the power of computer vision.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button
                onClick={() => navigate('/detect')}
                className="btn-primary"
                id="hero-cta-detect"
                style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
              >
                <Scan size={18} />
                Analyze a Leaf
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="btn-secondary"
                id="hero-cta-learn"
              >
                How It Works
              </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(74,222,128,0.1)' }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#4ade80', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(226,245,232,0.45)', marginTop: '0.35rem', lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Visual card ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            style={{ position: 'relative' }}
          >
            {/* Floating badge — top left of card */}
            <div style={{ position: 'absolute', top: '-18px', left: '16px', zIndex: 10 }}>
              <FloatingBadge icon={Zap} color="#fbbf24" label="Instant AI Analysis" delay={0.9} />
            </div>
            {/* Floating badge — bottom right of card */}
            <div style={{ position: 'absolute', bottom: '-18px', right: '16px', zIndex: 10 }}>
              <FloatingBadge icon={Shield} color="#22c55e" label="Expert Recommendations" delay={1.1} />
            </div>

            {/* Main glass card */}
            <div className="glass animate-float" style={{ padding: '2rem', position: 'relative', margin: '20px 0' }}>
              {/* Leaf preview */}
              <div style={{
                height: '220px', borderRadius: '1rem',
                background: 'linear-gradient(135deg, rgba(10,66,32,0.8) 0%, rgba(5,46,22,0.6) 100%)',
                border: '1px solid rgba(74,222,128,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden', marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '5.5rem', filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.4))' }}>🌿</div>
                {/* Scan line */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                  animation: 'scan 2.5s ease-in-out infinite',
                  boxShadow: '0 0 20px rgba(34,197,94,0.8)',
                }} />
                <div className="badge badge-green" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
                  Scanning
                </div>
              </div>

              {/* Detection result */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(226,245,232,0.45)', marginBottom: '0.25rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>DETECTED</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#e2f5e8' }}>Tomato Early Blight</div>
                </div>
                <div className="badge badge-gold">92% confidence</div>
              </div>

              <div className="confidence-bar" style={{ marginBottom: '1.25rem' }}>
                <div className="confidence-fill" style={{ width: '92%' }} />
              </div>

              <div style={{
                background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(74,222,128,0.18)',
                borderRadius: '0.75rem', padding: '0.875rem',
                fontSize: '0.81rem', color: 'rgba(226,245,232,0.72)', lineHeight: 1.65,
                display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
              }}>
                <span>💊</span>
                <span>Apply copper-based fungicide every 7–10 days. Remove infected leaves immediately.</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Feature cards row ─────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {features.map(({ icon: Icon, color, label, desc }, i) => (
            <motion.div
              key={label}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '0.65rem',
                background: `${color}18`,
                border: `1px solid ${color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#e2f5e8' }}>{label}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(226,245,232,0.5)', lineHeight: 1.6 }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="divider" />
    </section>
  );
}
