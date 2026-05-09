import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, FlaskConical, Lightbulb, Calendar, Loader2 } from 'lucide-react';
import { getHistoryRecord } from '../services/api';

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHistoryRecord(id)
      .then(setRecord)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Loader2 size={36} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />
    </main>
  );

  if (error || !record) return (
    <main className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '1rem' }}>
      <p style={{ color: '#f87171', fontSize: '1.1rem' }}>{error || 'Record not found'}</p>
      <button onClick={() => navigate('/history')} className="btn-secondary">← Back to History</button>
    </main>
  );

  const { plant, disease, confidence, solution, image_url, created_at } = record;

  return (
    <main className="page-wrapper" style={{ background: '#021a0d', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <button onClick={() => navigate('/history')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'transparent', border: 'none', color: '#4ade80', cursor: 'pointer',
          fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem',
        }}>
          <ArrowLeft size={16} /> Back to History
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image */}
          {image_url && (
            <div style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem', height: '280px', position: 'relative' }}>
              <img src={`http://localhost:8000/${image_url}`} alt="Plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(2,26,13,0.8) 100%)' }} />
            </div>
          )}

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Leaf size={15} color="#22c55e" />
                <span style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Plant</span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#4ade80' }}>{plant}</div>
            </div>
            <div className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FlaskConical size={15} color="#fbbf24" />
                <span style={{ fontSize: '0.75rem', color: 'rgba(226,245,232,0.5)', fontWeight: 600, textTransform: 'uppercase' }}>Disease</span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#e2f5e8' }}>{disease}</div>
            </div>
          </div>

          {/* Confidence */}
          <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(226,245,232,0.6)', fontSize: '0.88rem' }}>Confidence Score</span>
              <span style={{ fontWeight: 800, color: '#4ade80', fontSize: '1rem' }}>{confidence}%</span>
            </div>
            <div className="confidence-bar">
              <motion.div className="confidence-fill" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <Calendar size={13} color="rgba(226,245,232,0.35)" />
              <span style={{ fontSize: '0.78rem', color: 'rgba(226,245,232,0.4)' }}>{new Date(created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Solution */}
          <div className="glass" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Lightbulb size={18} color="#fbbf24" />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2f5e8' }}>Treatment Recommendation</span>
            </div>
            <p style={{ color: 'rgba(226,245,232,0.8)', lineHeight: 1.85, fontSize: '0.95rem', borderLeft: '3px solid rgba(74,222,128,0.4)', paddingLeft: '1rem' }}>
              {solution}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
