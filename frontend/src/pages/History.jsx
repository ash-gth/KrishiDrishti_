import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, RefreshCw, Loader2, SlidersHorizontal, X, InboxIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HistoryCard from '../components/HistoryCard';
import Footer from '../components/Footer';

function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{
          padding: '0.5rem 1rem', borderRadius: '0.65rem', border: '1px solid rgba(74,222,128,0.2)',
          background: 'transparent', color: page === 1 ? 'rgba(226,245,232,0.2)' : '#4ade80',
          cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600,
        }}
      >← Prev</button>

      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)} style={{
          width: '38px', height: '38px', borderRadius: '0.65rem', border: '1px solid',
          borderColor: p === page ? '#22c55e' : 'rgba(74,222,128,0.15)',
          background: p === page ? 'rgba(34,197,94,0.2)' : 'transparent',
          color: p === page ? '#4ade80' : 'rgba(226,245,232,0.5)',
          cursor: 'pointer', fontWeight: p === page ? 700 : 500, fontSize: '0.85rem',
        }}>{p}</button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{
          padding: '0.5rem 1rem', borderRadius: '0.65rem', border: '1px solid rgba(74,222,128,0.2)',
          background: 'transparent', color: page === totalPages ? 'rgba(226,245,232,0.2)' : '#4ade80',
          cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600,
        }}
      >Next →</button>
    </div>
  );
}

export default function HistoryPage() {
  const {
    history, historyTotal, historyPage, historyPageSize,
    historyLoading, historyFilter,
    fetchHistory, setHistoryFilter, setHistoryPage,
  } = useApp();

  const [searchPlant, setSearchPlant] = useState(historyFilter.plant || '');
  const [searchDisease, setSearchDisease] = useState(historyFilter.disease || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [historyPage, historyFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setHistoryFilter({ plant: searchPlant, disease: searchDisease });
  };

  const clearFilters = () => {
    setSearchPlant('');
    setSearchDisease('');
    setHistoryFilter({ plant: '', disease: '' });
  };

  const hasFilters = searchPlant || searchDisease;

  return (
    <>
      <main className="page-wrapper" style={{ background: '#021a0d', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(22,163,74,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(74,222,128,0.08)',
          padding: '3rem 1.5rem 2.5rem',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>
                <History size={12} /> Detection Log
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
                    Detection <span className="gradient-text">History</span>
                  </h1>
                  <p style={{ color: 'rgba(226,245,232,0.6)', fontSize: '0.95rem' }}>
                    {historyTotal} total records • Your plant health timeline
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => fetchHistory()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 1.25rem', borderRadius: '0.75rem',
                      background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                      color: '#4ade80', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <RefreshCw size={15} /> Refresh
                  </button>
                  <button
                    onClick={() => setShowFilters(f => !f)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 1.25rem', borderRadius: '0.75rem',
                      background: showFilters ? 'rgba(34,197,94,0.15)' : 'rgba(74,222,128,0.08)',
                      border: `1px solid ${showFilters ? 'rgba(74,222,128,0.35)' : 'rgba(74,222,128,0.2)'}`,
                      color: '#4ade80', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <SlidersHorizontal size={15} /> Filters {hasFilters && <span style={{ background: '#22c55e', color: '#021a0d', borderRadius: '999px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>!</span>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          {/* ── Filters ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {showFilters && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSearch}
                style={{ overflow: 'hidden' }}
              >
                <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(226,245,232,0.5)', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Plant Name</label>
                    <input value={searchPlant} onChange={e => setSearchPlant(e.target.value)} placeholder="e.g. Tomato" />
                  </div>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(226,245,232,0.5)', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Disease</label>
                    <input value={searchDisease} onChange={e => setSearchDisease(e.target.value)} placeholder="e.g. Blight" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                      <Search size={16} /> Search
                    </button>
                    {hasFilters && (
                      <button type="button" onClick={clearFilters} className="btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* ── Results ──────────────────────────────────────────────── */}
          {historyLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: '76px', borderRadius: '1.25rem' }} className="skeleton" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                textAlign: 'center', padding: '5rem 2rem',
                border: '1px dashed rgba(74,222,128,0.12)', borderRadius: '1.5rem',
              }}
            >
              <InboxIcon size={48} color="rgba(226,245,232,0.15)" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'rgba(226,245,232,0.4)', marginBottom: '0.75rem' }}>
                No records found
              </h3>
              <p style={{ color: 'rgba(226,245,232,0.25)', fontSize: '0.88rem' }}>
                {hasFilters ? 'Try adjusting your filters.' : 'Run your first detection to see history here.'}
              </p>
            </motion.div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((record, i) => (
                  <HistoryCard key={record.id} record={record} index={i} />
                ))}
              </div>
              <Pagination
                page={historyPage}
                total={historyTotal}
                pageSize={historyPageSize}
                onPageChange={(p) => { setHistoryPage(p); fetchHistory({ page: p }); }}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
