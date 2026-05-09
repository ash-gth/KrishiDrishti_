import { motion } from 'framer-motion';
import { Upload, Cpu, FlaskConical, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Leaf Image',
    desc: 'Take a clear photo of the affected plant leaf and upload it. We accept JPG, PNG, and WebP formats up to 10MB.',
    color: '#22c55e',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'AI Processes Image',
    desc: 'Our deep learning model analyzes color patterns, lesions, and morphological features in under 3 seconds.',
    color: '#818cf8',
  },
  {
    icon: FlaskConical,
    step: '03',
    title: 'Disease Identified',
    desc: 'The model returns a disease classification with a confidence score and matching the plant species.',
    color: '#fbbf24',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Get Treatment Plan',
    desc: 'Receive expert-curated treatment recommendations including fungicides, cultural practices, and prevention tips.',
    color: '#4ade80',
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '5rem 1.5rem', background: 'rgba(5,46,22,0.3)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>⚙️ Process</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: 'rgba(226,245,232,0.6)', maxWidth: '480px', margin: '0 auto' }}>
            From photo to diagnosis in four simple steps.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: '32px', left: '12.5%', right: '12.5%', height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), rgba(74,222,128,0.3), transparent)',
            display: 'none',
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  background: 'rgba(5,46,22,0.5)', border: '1px solid rgba(74,222,128,0.12)',
                  borderRadius: '1.25rem', padding: '2rem 1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem',
                  position: 'relative',
                }}
              >
                {/* Step number */}
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: '#052e16', border: `1px solid ${color}40`,
                  borderRadius: '999px', padding: '0.2rem 0.75rem',
                  fontSize: '0.72rem', fontWeight: 700, color, letterSpacing: '0.08em',
                }}>
                  {step}
                </div>

                {/* Icon */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: `${color}15`, border: `2px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 30px ${color}20`,
                }}>
                  <Icon size={28} color={color} />
                </div>

                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2f5e8' }}>{title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(226,245,232,0.55)', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
