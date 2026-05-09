import { motion } from 'framer-motion';
import { Trash2, Eye, Leaf, ChevronRight, Calendar, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function getSeverityColor(confidence) {
  if (confidence >= 85) return '#4ade80';
  if (confidence >= 65) return '#fbbf24';
  return '#f87171';
}

export default function HistoryCard({ record, index }) {
  const { removeRecord } = useApp();
  const navigate = useNavigate();
  const { id, plant, disease, confidence, created_at } = record;
  const color = getSeverityColor(confidence);
  const isHealthy = disease === 'Healthy';

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this detection record?')) return;
    await removeRecord(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/history/${id}`)}
      style={{ cursor: 'pointer' }}
      className="card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Color indicator */}
        <div style={{
          width: '44px', height: '44px', flexShrink: 0,
          borderRadius: '0.75rem',
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={20} color={color} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2f5e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {plant}
            </span>
            <span style={{ color: 'rgba(226,245,232,0.4)', fontSize: '0.75rem' }}>—</span>
            <span style={{ fontSize: '0.85rem', color: isHealthy ? '#4ade80' : 'rgba(226,245,232,0.7)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {disease}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={11} color="rgba(226,245,232,0.3)" />
              <span style={{ fontSize: '0.72rem', color: 'rgba(226,245,232,0.4)' }}>
                {new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BarChart size={11} color={color} />
              <span style={{ fontSize: '0.72rem', color, fontWeight: 600 }}>{confidence}%</span>
            </div>
          </div>
        </div>

        {/* Confidence pill */}
        <div style={{
          padding: '0.25rem 0.75rem', borderRadius: '999px',
          background: `${color}15`, border: `1px solid ${color}30`,
          fontSize: '0.8rem', fontWeight: 700, color,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {confidence}%
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/history/${id}`); }}
            style={{
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '0.5rem', padding: '0.4rem', color: '#4ade80', cursor: 'pointer',
              display: 'flex',
            }}
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '0.5rem', padding: '0.4rem', color: '#f87171', cursor: 'pointer',
              display: 'flex',
            }}
            title="Delete record"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <ChevronRight size={14} color="rgba(226,245,232,0.25)" />
      </div>
    </motion.div>
  );
}
