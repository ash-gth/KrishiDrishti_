import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Leaf, FlaskConical, Lightbulb, Calendar, Share2, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

function getSeverityBadge(disease) {
  if (disease === 'Healthy') return { label: 'Healthy', class: 'badge-green', color: '#22c55e' };
  const high = ['Blight', 'Rust', 'Blast', 'Rot'];
  const isHigh = high.some(h => disease.includes(h));
  return isHigh
    ? { label: 'High Severity', class: 'badge-red', color: '#ef4444' }
    : { label: 'Moderate', class: 'badge-gold', color: '#f59e0b' };
}

function ConfidenceRing({ value }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value > 85 ? '#22c55e' : value > 65 ? '#fbbf24' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color }}>{value}%</span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(226,245,232,0.5)', marginTop: '0.1rem' }}>Confidence</span>
      </div>
    </div>
  );
}

export default function DetectionResult() {
  const { currentDetection, previewUrl } = useApp();

  if (!currentDetection) return null;

  const { plant, disease, confidence, solution, image_url, created_at } = currentDetection;
  const severity = getSeverityBadge(disease);
  const isHealthy = disease === 'Healthy';

  const handleShare = async () => {
    const text = `🌿 KrishiDrishti Detection: ${plant} — ${disease} (${confidence}% confidence)\nTreatment: ${solution}`;
    if (navigator.share) {
      await navigator.share({ title: 'KrishiDrishti Result', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard!');
    }
  };

  return (
    <motion.div
      key={currentDetection.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* ── Header banner ───────────────────────────────────── */}
      <div style={{
        background: isHealthy
          ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(74,222,128,0.08))'
          : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(251,191,36,0.08))',
        border: `1px solid ${isHealthy ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.2)'}`,
        borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: isHealthy ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isHealthy
              ? <CheckCircle size={26} color="#22c55e" />
              : <AlertTriangle size={26} color="#ef4444" />
            }
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)', marginBottom: '0.2rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Detection Result</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#e2f5e8' }}>
              {plant} — {disease}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className={`badge ${severity.class}`}>{severity.label}</span>
          <button onClick={handleShare} style={{
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '0.65rem', padding: '0.5rem', color: '#4ade80', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Image + Confidence */}
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {previewUrl && (
            <div style={{ position: 'relative', borderRadius: '0.875rem', overflow: 'hidden', height: '180px' }}>
              <img src={previewUrl} alt="Analyzed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(2,26,13,0.7) 100%)',
              }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)', marginBottom: '0.35rem' }}>Plant Identified</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#4ade80' }}>
                <Leaf size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                {plant}
              </div>
            </div>
            <ConfidenceRing value={Math.round(confidence)} />
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Disease */}
          <div className="glass" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FlaskConical size={15} color="#fbbf24" />
              <span style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Disease</span>
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#e2f5e8' }}>{disease}</div>
          </div>

          {/* Confidence bar */}
          <div className="glass" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(226,245,232,0.6)' }}>Model Confidence</span>
              <span style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.9rem' }}>{confidence}%</span>
            </div>
            <div className="confidence-bar">
              <motion.div
                className="confidence-fill"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Timestamp */}
          {created_at && (
            <div className="glass" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} color="rgba(226,245,232,0.4)" />
              <span style={{ fontSize: '0.8rem', color: 'rgba(226,245,232,0.5)' }}>
                {new Date(created_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Solution ─────────────────────────────────────────── */}
      <div className="glass" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '0.5rem',
            background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={18} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2f5e8' }}>Treatment Recommendation</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)' }}>Expert-level guidance</div>
          </div>
        </div>
        <p style={{ color: 'rgba(226,245,232,0.8)', lineHeight: 1.85, fontSize: '0.95rem', borderLeft: '3px solid rgba(74,222,128,0.4)', paddingLeft: '1rem' }}>
          {solution}
        </p>
      </div>
    </motion.div>
  );
}
