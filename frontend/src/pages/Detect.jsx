import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Loader2, RotateCcw, Lightbulb, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UploadZone from '../components/UploadZone';
import DetectionResult from '../components/DetectionResult';
import Footer from '../components/Footer';

function UploadProgress({ progress }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(226,245,232,0.6)' }}>Uploading & analyzing...</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80' }}>{progress}%</span>
      </div>
      <div className="confidence-bar">
        <motion.div
          className="confidence-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

function TipCard({ icon: Icon, tip }) {
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      padding: '0.875rem 1rem',
      background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(74,222,128,0.12)',
      borderRadius: '0.75rem',
    }}>
      <Icon size={15} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
      <span style={{ fontSize: '0.82rem', color: 'rgba(226,245,232,0.65)', lineHeight: 1.6 }}>{tip}</span>
    </div>
  );
}

const TIPS = [
  { icon: Lightbulb, tip: 'Use natural daylight for clearer photos. Avoid harsh shadows on the leaf.' },
  { icon: Info, tip: 'Focus on affected areas. A single clear leaf photo gives the best results.' },
  { icon: Lightbulb, tip: 'Hold the camera steady and capture the leaf filling most of the frame.' },
];

export default function Detect() {
  const { selectedFile, previewUrl, detectionLoading, uploadProgress, currentDetection, runDetection, clearDetection } = useApp();

  const handleDetect = () => {
    runDetection();
  };

  const handleReset = () => {
    clearDetection();
  };

  return (
    <>
      <main className="page-wrapper" style={{ background: '#021a0d', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(22,163,74,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(74,222,128,0.08)',
          padding: '3rem 1.5rem 2.5rem',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>
                <Scan size={12} /> AI Detection Lab
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
                Detect Plant <span className="gradient-text">Disease</span>
              </h1>
              <p style={{ color: 'rgba(226,245,232,0.6)', fontSize: '1rem', maxWidth: '500px' }}>
                Upload a clear photo of a plant leaf and our AI will identify any disease within seconds.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>

            {/* ── Left: Upload panel ───────────────────────────────── */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="glass" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2f5e8', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#4ade80' }}>1</span>
                  Upload Leaf Image
                </h2>
                <UploadZone />
                {detectionLoading && <UploadProgress progress={uploadProgress} />}
              </div>

              {/* Detect Button */}
              <AnimatePresence>
                {selectedFile && !detectionLoading && !currentDetection && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleDetect}
                    className="btn-primary animate-pulse-glow"
                    id="detect-submit-btn"
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', marginBottom: '1rem' }}
                  >
                    <Scan size={20} />
                    Run AI Detection
                  </motion.button>
                )}
                {detectionLoading && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                      padding: '1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: '0.75rem', color: '#4ade80', fontSize: '0.95rem', fontWeight: 600,
                      marginBottom: '1rem',
                    }}
                  >
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Analyzing with AI...
                  </motion.div>
                )}
                {currentDetection && (
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={handleReset}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginBottom: '1rem' }}
                  >
                    <RotateCcw size={16} />
                    Analyze Another Plant
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Photo tips */}
              {!currentDetection && (
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#4ade80', marginBottom: '1rem' }}>
                    📸 Photo Tips
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {TIPS.map((t, i) => <TipCard key={i} {...t} />)}
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Right: Results ───────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <AnimatePresence mode="wait">
                {!currentDetection && !detectionLoading ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                      height: '500px', borderRadius: '1.5rem',
                      border: '1px dashed rgba(74,222,128,0.15)',
                      background: 'rgba(5,46,22,0.2)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '1rem',
                      textAlign: 'center', padding: '3rem',
                    }}
                  >
                    <div style={{ fontSize: '5rem', opacity: 0.25 }}>🔬</div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'rgba(226,245,232,0.35)' }}>
                      Results appear here
                    </h3>
                    <p style={{ color: 'rgba(226,245,232,0.25)', fontSize: '0.85rem', maxWidth: '280px' }}>
                      Upload a leaf photo and click "Run AI Detection" to see the diagnosis
                    </p>
                  </motion.div>
                ) : detectionLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                      height: '500px', borderRadius: '1.5rem',
                      border: '1px solid rgba(74,222,128,0.2)',
                      background: 'rgba(5,46,22,0.3)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
                    }}
                  >
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '3px solid rgba(34,197,94,0.15)',
                        borderTopColor: '#22c55e',
                        animation: 'spin 1s linear infinite',
                      }} />
                      <div style={{ position: 'absolute', inset: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🌿</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                        AI is analyzing your plant...
                      </p>
                      <p style={{ color: 'rgba(226,245,232,0.5)', fontSize: '0.85rem' }}>
                        Scanning for disease patterns & lesions
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <DetectionResult />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
