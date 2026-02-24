import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Zap, Layers, ExternalLink } from 'lucide-react';

const Announcer = ({ announcement, aiCommentary, isAIEnabled }) => {
    return (
        <section className="mb-16">
            <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                {/* Advanced AI Unit Card */}
                <div className="w-full xl:w-[320px] glass-panel p-8 flex flex-col items-center justify-between border-blue-500/20 shadow-glow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                    <div className="relative mb-8 pt-4">
                        {/* Interactive AI Core SVG */}
                        <div className="w-48 h-48 relative z-10 transition-transform duration-700 group-hover:scale-105">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                {/* Outer Ring */}
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" strokeDasharray="5,5"
                                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Inner Components */}
                                <rect x="25" y="30" width="50" height="40" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                                <rect x="30" y="35" width="40" height="30" rx="4" fill="#020617" />

                                {/* Eyes / Sensors */}
                                <motion.circle
                                    cx="40" cy="45" r="4" fill="#3b82f6"
                                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.circle
                                    cx="60" cy="45" r="4" fill="#3b82f6"
                                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                />

                                {/* Reactive Mouth / Spectrum */}
                                <motion.g
                                    animate={announcement ? { opacity: [1, 0.6, 1] } : { opacity: 0.3 }}
                                >
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <motion.rect
                                            key={i}
                                            x={40 + (i * 4)} y="55" width="2" height="4" rx="1" fill="#60a5fa"
                                            animate={announcement ? { height: [4, 12, 4], y: [55, 51, 55] } : {}}
                                            transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                                        />
                                    ))}
                                </motion.g>
                            </svg>
                        </div>
                        {/* Background Orbitals */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <div className="w-full h-full border border-blue-500/30 rounded-full animate-float" />
                        </div>
                    </div>

                    <div className="w-full text-center space-y-4">
                        <div className="space-y-1">
                            <h4 className="text-base font-black tracking-widest text-blue-400">CORE_UNIT_BETA</h4>
                            <p className="text-[11px] font-mono text-slate-500">NEURAL_ENGINE_STATUS: L3_ACTIVE</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Processing_Data</span>
                        </div>
                    </div>
                </div>

                {/* Main Event Signal Panel */}
                <div className="flex-grow broadcast-screen min-h-[450px] flex flex-col relative">
                    <div className="scanline" />

                    {/* Panel UI Overlays */}
                    <div className="absolute top-6 left-8 flex items-center gap-6 z-20">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-400/50" />
                            <span className="text-[11px] font-mono text-blue-400/40 uppercase tracking-widest">Layer_Event_01</span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400/50" />
                            <span className="text-[11px] font-mono text-yellow-400/40 uppercase tracking-widest">Boost_Mode: v2</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center text-center p-12 relative z-20">
                        <AnimatePresence mode="wait">
                            {announcement ? (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="max-w-4xl space-y-10"
                                >
                                    <div className="inline-flex items-center gap-4 px-5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-glow">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-[12px] font-black text-blue-400 uppercase tracking-[0.4em]">Incoming_{announcement.eventType}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <a
                                            href={`https://github.com/${announcement.repoName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block group"
                                        >
                                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] transition-all duration-500 group-hover:scale-[1.02]">
                                                {announcement.repoName.split('/')[0]}
                                                <span className="block text-blue-500 flex items-center justify-center gap-4">
                                                    {announcement.repoName.split('/')[1]}
                                                    <ExternalLink className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                            </h2>
                                        </a>
                                        <div className="flex items-center justify-center gap-6 text-sm font-mono text-slate-400">
                                            <a
                                                href={`https://github.com/${announcement.actor}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-400 transition-colors"
                                            >
                                                ACTOR: @{announcement.actor}
                                            </a>
                                            <span className="opacity-30">|</span>
                                            <span>SIG_TIME: {new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    {isAIEnabled && (
                                        <div className="pt-12 border-t border-white/5 space-y-5">
                                            <div className="flex items-center justify-center gap-3 opacity-40">
                                                <Terminal className="w-4 h-4" />
                                                <span className="text-[11px] uppercase font-bold tracking-widest">Neural_Interpretation_Sequence</span>
                                            </div>
                                            <p className="text-2xl md:text-4xl font-bold text-white italic leading-snug max-w-3xl mx-auto selection:bg-blue-500/30">
                                                “{aiCommentary || "Synthesizing event parameters for neural broadcast..."}”
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-8"
                                >
                                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
                                    <p className="font-orbitron text-base tracking-[0.5em] text-blue-400/40 uppercase animate-pulse">Awaiting Uplink Stream...</p>
                                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Status Ticker Overlay */}
                    <div className="py-3 px-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-widest z-20">
                        <div className="flex items-center gap-6">
                            <span>BUFFER_SIG: 100%</span>
                            <span>DATA_RATE: 4.2 MB/S</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span>STATION: BLT_NEURAL_UPLINK</span>
                            <span className="text-blue-500/50 font-bold">SYSTEM_NOMINAL_TRUE</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Announcer;
