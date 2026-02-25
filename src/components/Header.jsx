import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Radio, Shield, Cpu, Activity } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    {/* Industrial Geometric Brandmark */}
                    <div className="w-16 h-16 tech-panel flex items-center justify-center relative overflow-hidden group-hover:border-accent-theme transition-all duration-500" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />

                        <svg viewBox="0 0 100 100" className="w-10 h-10">
                            <motion.path
                                d="M20,20 L80,20 L80,35 L35,35 L35,50 L80,50 L80,80 L20,80 L20,65 L65,65 L65,50 L20,50 Z"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            />
                            <rect x="45" y="45" width="10" height="10" fill="var(--accent)">
                                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                            </rect>
                        </svg>

                        <motion.div
                            className="absolute inset-0"
                            style={{ backgroundColor: 'var(--accent)', opacity: 0.05 }}
                            animate={{ opacity: [0, 0.1, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-black uppercase tracking-widest" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-base)', fontSize: '11px' }}>
                            Live_Broadcast
                        </span>
                        <span className="hud-dec">Protocol_v4.2</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-[0.05em] uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
                        NEURAL<span style={{ color: 'var(--text-secondary)' }}>_UPLINK</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <HeaderStat icon={<Activity className="text-emerald-500" />} label="Stream" status="NOMINAL" />
                <HeaderStat icon={<Shield className="text-cyan-500" />} label="Auth" status="SECURE" />
                <HeaderStat icon={<Cpu className="text-pink-500" />} label="Cores" status="L3_ACTIVE" />
            </div>

            {/* Top Border HUD */}
            <div className="absolute -top-12 left-0 right-0 h-[1px] flex items-center justify-center" style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)', opacity: 0.3 }}>
                <div className="px-4 text-[10px] font-mono tracking-[1em] uppercase font-bold" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
                    Neural_Network_Handshake_Complete
                </div>
            </div>
        </header>
    );
};

const HeaderStat = ({ icon, label, status }) => (
    <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
            <span className="hud-dec">{label}</span>
            <div className="opacity-60">{icon}</div>
        </div>
        <div className="text-[11px] font-black tracking-widest border-r-2 pr-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--accent)' }}>
            {status}
        </div>
    </div>
);

export default Header;
