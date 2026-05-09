import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const areaData = [
  { month: 'Jan', detections: 12 },
  { month: 'Feb', detections: 28 },
  { month: 'Mar', detections: 41 },
  { month: 'Apr', detections: 35 },
  { month: 'May', detections: 67 },
  { month: 'Jun', detections: 89 },
];

const pieData = [
  { name: 'Blight', value: 38, color: '#ef4444' },
  { name: 'Rust', value: 24, color: '#f59e0b' },
  { name: 'Mildew', value: 19, color: '#a78bfa' },
  { name: 'Healthy', value: 19, color: '#22c55e' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(5,46,22,0.95)', border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '0.65rem', padding: '0.65rem 1rem', fontSize: '0.82rem',
      }}>
        <p style={{ color: '#4ade80', fontWeight: 700 }}>{label}</p>
        <p style={{ color: 'rgba(226,245,232,0.8)' }}>{payload[0].value} detections</p>
      </div>
    );
  }
  return null;
};

export default function StatsSection() {
  return (
    <section style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="section-tag" style={{ display: 'inline-flex' }}>
          <Activity size={12} /> Platform Statistics
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Detection <span className="gradient-text">Insights</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Area chart */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} color="#22c55e" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#e2f5e8' }}>Monthly Detections</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(74,222,128,0.06)" strokeDasharray="4 4" />
              <XAxis dataKey="month" stroke="rgba(226,245,232,0.3)" tick={{ fontSize: 11, fill: 'rgba(226,245,232,0.5)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(226,245,232,0.3)" tick={{ fontSize: 11, fill: 'rgba(226,245,232,0.5)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="detections" stroke="#22c55e" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Leaf size={18} color="#4ade80" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#e2f5e8' }}>Disease Split</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ background: 'rgba(5,46,22,0.95)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pieData.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(226,245,232,0.7)' }}>{name}</span>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
