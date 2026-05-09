import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] };

export default function UploadZone() {
  const { selectFile, previewUrl, selectedFile, clearDetection } = useApp();

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      alert(err.code === 'file-too-large' ? 'File too large (max 10MB)' : 'Only JPG, PNG, WebP allowed.');
      return;
    }
    if (accepted[0]) selectFile(accepted[0]);
  }, [selectFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    clearDetection();
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!previewUrl ? (
          /* ── Drop area ───────────────────────────────────────── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            {...getRootProps()}
            className={`upload-zone ${isDragActive ? 'active' : ''}`}
            style={{ padding: '3.5rem 2rem', textAlign: 'center', minHeight: '280px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
            id="upload-dropzone"
          >
            <input {...getInputProps()} id="file-input" />

            <motion.div
              animate={{ scale: isDragActive ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: isDragActive ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.1)',
                border: `2px solid ${isDragActive ? '#22c55e' : 'rgba(74,222,128,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              {isDragActive
                ? <Image size={32} color="#22c55e" />
                : <Upload size={32} color="#4ade80" />
              }
            </motion.div>

            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#e2f5e8', marginBottom: '0.5rem' }}>
                {isDragActive ? '✨ Drop it here!' : 'Drag & Drop your leaf image'}
              </p>
              <p style={{ color: 'rgba(226,245,232,0.5)', fontSize: '0.85rem' }}>
                or <span style={{ color: '#22c55e', fontWeight: 600, cursor: 'pointer' }}>browse files</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['JPG', 'PNG', 'WebP'].map(fmt => (
                <span key={fmt} style={{
                  padding: '0.2rem 0.6rem', borderRadius: '999px',
                  background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
                  fontSize: '0.72rem', color: 'rgba(226,245,232,0.6)', fontWeight: 600,
                }}>{fmt}</span>
              ))}
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '999px',
                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
                fontSize: '0.72rem', color: 'rgba(226,245,232,0.6)', fontWeight: 600,
              }}>Max 10 MB</span>
            </div>
          </motion.div>

        ) : (
          /* ── Preview area ────────────────────────────────────── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'relative', borderRadius: '1.5rem', overflow: 'hidden',
              border: '1px solid rgba(74,222,128,0.25)',
            }}
          >
            <img
              src={previewUrl}
              alt="Uploaded leaf"
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(2,26,13,0.9) 100%)',
            }} />
            {/* File info */}
            <div style={{
              position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#4ade80" />
                <span style={{ color: '#e2f5e8', fontSize: '0.85rem', fontWeight: 600 }}>
                  {selectedFile?.name}
                </span>
                <span style={{ color: 'rgba(226,245,232,0.5)', fontSize: '0.75rem' }}>
                  ({(selectedFile?.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button onClick={handleRemove} style={{
                background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '0.5rem', padding: '0.35rem',
                color: '#fca5a5', cursor: 'pointer', display: 'flex',
              }}>
                <X size={16} />
              </button>
            </div>
            {/* Scan line on preview */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
              animation: 'scan 3s ease-in-out infinite',
              boxShadow: '0 0 15px rgba(34,197,94,0.7)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
