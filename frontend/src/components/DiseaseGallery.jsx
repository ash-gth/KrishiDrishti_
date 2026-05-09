import { motion } from 'framer-motion';

const diseases = [
  { emoji: '🍅', plant: 'Tomato', disease: 'Early Blight', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  { emoji: '🥔', plant: 'Potato', disease: 'Leaf Roll', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  { emoji: '🌽', plant: 'Corn', disease: 'Northern Blight', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  { emoji: '🌾', plant: 'Rice', disease: 'Rice Blast', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  { emoji: '🌿', plant: 'Wheat', disease: 'Stripe Rust', color: '#a3e635', bg: 'rgba(163,230,53,0.1)', border: 'rgba(163,230,53,0.2)' },
  { emoji: '🍎', plant: 'Apple', disease: 'Apple Scab', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  { emoji: '🍇', plant: 'Grape', disease: 'Powdery Mildew', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
  { emoji: '🫑', plant: 'Pepper', disease: 'Bacterial Spot', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
];

export default function DiseaseGallery() {
  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="section-tag" style={{ display: 'inline-flex' }}>🧬 Disease Library</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Diseases We <span className="gradient-text">Detect</span>
        </h2>
        <p style={{ color: 'rgba(226,245,232,0.6)', maxWidth: '500px', margin: '0 auto', fontSize: '1rem' }}>
          Our AI model is trained to identify 38+ plant diseases across major crop types.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {diseases.map(({ emoji, plant, disease, color, bg, border }, i) => (
          <motion.div
            key={disease}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.03, y: -4 }}
            style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: '1rem', padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              cursor: 'default', transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{emoji}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#e2f5e8', marginBottom: '0.25rem' }}>
                {plant}
              </div>
              <div style={{ fontSize: '0.78rem', color, fontWeight: 500 }}>{disease}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
