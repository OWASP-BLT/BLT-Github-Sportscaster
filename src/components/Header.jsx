import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Globe, Zap, ShieldCheck } from 'lucide-react';

const Header = () => {
    return (
        <header className="relative w-full mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-6">
                    {/* Brand Identity */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] relative z-10">
                                <Radio className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse-live" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter neon-text leading-none mb-1">
                                GITHUB <span className="text-white/90">SPORTSCASTER</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em] shimmer-text">
                                    Neural_Broadcast_Protocol_v4.2
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Status HUD */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="hidden lg:flex items-center gap-10 px-10 py-4 rounded-full glass-panel border border-white/10">
                        <StatusItem icon={<Globe className="w-5 h-5 text-blue-400" />} label="Global Uplink" value="ACTIVE" />
                        <div className="w-px h-8 bg-white/10" />
                        <StatusItem icon={<Zap className="w-5 h-5 text-yellow-400" />} label="Latency" value="12ms" />
                        <div className="w-px h-8 bg-white/10" />
                        <StatusItem icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} label="Security" value="SECURE" />
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 group cursor-default">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                        <span className="text-sm font-black text-red-500 uppercase tracking-widest group-hover:scale-105 transition-transform">SIGNAL_LIVE</span>
                    </div>
                </motion.div>
            </div>

            {/* Ambient Line */}
            <div className="absolute -bottom-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </header>
    );
};

const StatusItem = ({ icon, label, value }) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-sm font-mono font-bold text-slate-200">{value}</span>
    </div>
);

export default Header;
