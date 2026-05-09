import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import DiseaseGallery from '../components/DiseaseGallery';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scan, ArrowRight } from 'lucide-react';

function CTABanner() {
  const navigate = useNavigate();
  return (
    <section style={{ padding: '2rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(10,66,32,0.4) 100%)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '2rem', padding: '4rem 3rem',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-50px', left: '-50px',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🌱</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: '#e2f5e8' }}>
            Ready to Protect Your Crops?
          </h2>
          <p style={{ color: 'rgba(226,245,232,0.65)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Upload a leaf image right now and get an AI diagnosis in under 3 seconds. Free to use.
          </p>
          <button onClick={() => navigate('/detect')} className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }} id="cta-final-detect">
            <Scan size={20} />
            Analyze Your Plant
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main className="page-wrapper">
        <Hero />
        <HowItWorks />
        <DiseaseGallery />
        <StatsSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
