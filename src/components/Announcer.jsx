import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Layers, ExternalLink, Radio } from 'lucide-react';

const BotDisplay = ({ announcement, isSpeaking, mouthOpenLevel }) => {
    const isTalking = isSpeaking;
    const barHeights = [4, 8, 12, 10, 6];

    return (
        <div className="w-64 h-64 relative group">
            {/* HUD Decoration around bot */}
            <div className="absolute -inset-4 border pointer-events-none" style={{ borderColor: 'var(--border-subtle)', opacity: 0.1 }} />
            <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)', opacity: 0.4 }} />
            <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)', opacity: 0.4 }} />

            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow))' }}
                animate={isSpeaking ? {
                    x: [0, -1, 1, -1, 0],
                    y: [0, 1, -1, 1, 0],
                    filter: [
                        'drop-shadow(0 0 10px var(--accent-glow))',
                        'drop-shadow(-2px 0 0 rgba(255,0,122,0.4)) drop-shadow(2px 0 0 var(--accent-glow))',
                        'drop-shadow(0 0 10px var(--accent-glow))'
                    ]
                } : {}}
                transition={{ duration: 0.2, repeat: Infinity }}
            >
                {/* Scanner Backdrop */}
                <rect x="15" y="15" width="70" height="70" fill="var(--bg-card-hover)" stroke="var(--border-subtle)" strokeWidth="0.5" />

                {/* Head - Industrial Sharp Shape */}
                <path d="M20,30 L80,30 L85,40 L85,70 L80,80 L20,80 L15,70 L15,40 Z" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5" />

                {/* Secondary inner frame */}
                <path d="M24,34 L76,34 L80,42 L80,68 L76,76 L24,76 L20,68 L20,42 Z" fill="var(--bg-base)" stroke="var(--border-subtle)" strokeWidth="0.8" />

                {/* Multi-Lens Sensor Array (Replacing generic eyes) */}
                <g transform="translate(28, 42)">
                    {/* Main Lens */}
                    <rect x="0" y="0" width="18" height="12" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="0.5" />
                    <motion.rect
                        x="2" y="2" width="14" height="8"
                        fill="var(--accent)"
                        animate={isSpeaking ? { opacity: [0.2, 1, 0.2], scale: [1, 1.05, 1] } : { opacity: 0.6 }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                    />
                    <circle cx="9" cy="6" r="1.5" fill="var(--text-primary)" opacity="0.4" />
                </g>

                <g transform="translate(54, 42)">
                    {/* Secondary Sensors */}
                    <rect x="0" y="0" width="18" height="5" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="0.5" />
                    <motion.rect
                        x="1" y="1" width="16" height="3"
                        fill="#10b981"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <rect x="0" y="7" width="8" height="5" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="0.5" />
                    <rect x="10" y="7" width="8" height="5" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="0.5" />
                    <motion.circle cx="4" cy="9.5" r="1" fill="#ef4444" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                    <motion.circle cx="14" cy="9.5" r="1" fill="#ef4444" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }} />
                </g>

                {/* Scanline overlay on face */}
                <motion.rect
                    x="15" y="30" width="70" height="2" fill="var(--accent)" opacity="0.1"
                    animate={isTalking
                        ? { y: [30, 80, 30], opacity: [0.1, 0.4, 0.1] }
                        : { y: [30, 80, 30] }}
                    transition={isTalking
                        ? { duration: 1.5, repeat: Infinity, ease: "linear" }
                        : { duration: 5, repeat: Infinity, ease: "linear" }}
                />

                {/* Mouth Slit */}
                {/* <rect x="35" y="60" width="30" height="4" rx="2" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="0.5" /> */}

                {/* Reactive Mouth Bars */}
                <g transform="translate(37, 62)">
                    {[0, 1, 2, 3, 4].map(i => {
                        // h is higher when mouthOpenLevel is active, but always at least 4 when speaking
                        const h = isSpeaking
                            ? (mouthOpenLevel > 0 ? (mouthOpenLevel * 2) + 4 : 4)
                            : (announcement ? 2 : 0);
                        return (
                            <motion.rect
                                key={i}
                                x={i * 5.5}
                                y={-h / 4}
                                width="3"
                                height={h}
                                rx="1.5"
                                fill="var(--accent)"
                                style={{ filter: isSpeaking ? `drop-shadow(0 0 ${h}px var(--accent-glow))` : 'none' }}
                                animate={{ height: h, y: -h / 2 }}
                                transition={{ duration: 0.1 }}
                            />
                        );
                    })}
                </g>

                {/* Data Bars on Chest */}
                {/* <g transform="translate(30, 72)">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <motion.rect
                            key={i} x={i * 6} y={0} width="3" height="10"
                            fill={isTalking ? "#ff007a" : "var(--accent)"}
                            opacity={isTalking ? 1 : 0.1}
                            animate={isTalking ? { height: [4, 10, 4], opacity: [0.5, 1, 0.5] } : { height: 4, opacity: 0.3 }}
                            transition={{ duration: 0.15, repeat: Infinity, delay: i * 0.05 }}
                        />
                    ))}
                </g> */}

                {/* Antenna pulse */}
                <line x1="50" y1="30" x2="50" y2="20" stroke="var(--accent)" strokeWidth="1" />
                <motion.rect
                    x="48" y="16" width="4" height="4"
                    fill="var(--accent)"
                    animate={isSpeaking ? { filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'] } : {}}
                    transition={{ duration: 0.3, repeat: Infinity }}
                />
            </motion.svg>
        </div>
    );
};

const Announcer = ({ announcement, aiCommentary, isAIEnabled, isSpeaking, mouthOpenLevel }) => {
    return (
        <section className="mb-16">
            <div className="flex flex-col xl:flex-row gap-0 items-stretch">
                {/* ── Bot Module ── */}
                <div className="w-full xl:w-[350px] tech-panel p-10 flex flex-col items-center justify-between border-r-0 corner-tl corner-bl">
                    <div className="tech-header w-full" style={{ borderColor: 'var(--border-subtle)' }}>
                        <span className="hud-dec">UNIT_SERIAL: CY-01</span>
                        <Radio
                            className={`w-4 h-4 transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
                            style={{
                                color: isSpeaking ? 'var(--accent)' : 'var(--text-muted)',
                                opacity: isSpeaking ? 1 : 0.4
                            }}
                        />
                    </div>

                    <BotDisplay
                        announcement={announcement}
                        isSpeaking={isSpeaking}
                        mouthOpenLevel={mouthOpenLevel}
                    />

                    <div className="w-full mt-8 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Neural Status</h4>
                                <div className="text-2xl font-black neon-text-cyan uppercase">LINK_ACTIVE</div>
                            </div>
                            <div className="text-right">
                                <span className="hud-dec">Vocal_Node</span>
                                <div className="text-[11px] font-bold opacity-60">FREQ: 44.1KHZ</div>
                            </div>
                        </div>

                        <div className="h-1 w-full bg-surface-theme/30 overflow-hidden relative">
                            <motion.div
                                className="absolute h-full left-0 bg-accent-theme shadow-glow"
                                style={{ backgroundColor: 'var(--accent)' }}
                                animate={{ width: isSpeaking ? ['20%', '100%', '20%'] : '5%' }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Main Broadcast Module ── */}
                <div className="flex-grow broadcast-screen min-h-[500px] flex flex-col relative corner-tr corner-br">
                    <div className="scanline" />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--accent-glow), transparent)', opacity: 0.05 }} />

                    {/* HUD Overlays */}
                    <div className="absolute top-8 left-10 flex items-center gap-8 z-20">
                        <div className="flex items-center gap-3">
                            <Layers className="w-4 h-4 opacity-40" />
                            <span className="hud-dec">Buffer_Stream: 0xA42</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-pink-500 opacity-40" />
                            <span className="hud-dec">Glitch_Prot: OFF</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center text-center p-16 relative z-20">
                        <AnimatePresence mode="wait">
                            {announcement ? (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-4xl space-y-8 transform translate-y-8"
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-16 h-[1px] opacity-30" style={{ backgroundColor: 'var(--accent)' }} />
                                        <span className="text-base font-black uppercase tracking-[0.6em] animate-glitch" style={{ color: 'var(--accent)' }}>
                                            Incoming Signal
                                        </span>
                                        <div className="w-16 h-[1px] opacity-30" style={{ backgroundColor: 'var(--accent)' }} />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none" style={{ color: 'var(--text-primary)' }}>
                                            {announcement.repoName.split('/')[0]}
                                            <span className="block neon-text-cyan">
                                                {announcement.repoName.split('/')[1]}
                                            </span>
                                        </h2>

                                        <div className="flex items-center justify-center gap-8 pt-4">
                                            <div className="text-left">
                                                <span className="hud-dec">Actor</span>
                                                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>@{announcement.actor}</div>
                                            </div>
                                            <div className="w-[1px] h-8 opacity-20" style={{ backgroundColor: 'var(--accent)' }} />
                                            <div className="text-left">
                                                <span className="hud-dec">Event Type</span>
                                                <div className="text-lg font-bold text-pink-500">{announcement.eventType.replace('Event', '')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {isAIEnabled && (
                                        <div className="pt-12 border-t border-white/10" style={{ borderColor: 'var(--border-subtle)' }}>
                                            <p className="text-2xl font-bold italic leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
                                                "{aiCommentary || 'Synthesizing neural interpretation...'}"
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div className="flex flex-col items-center gap-4 opacity-40">
                                    <Terminal className="w-8 h-8 animate-pulse" style={{ color: 'var(--accent)' }} />
                                    <p className="text-xs uppercase tracking-[0.8em]" style={{ color: 'var(--accent)' }}>Wait for Uplink</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer HUD */}
                    <div className="py-4 px-12 border-t flex items-center justify-between z-20" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex gap-12">
                            <div className="flex flex-col">
                                <span className="hud-dec">Data_Rate</span>
                                <span className="text-sm font-black tracking-widest">4.21 MB/s</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="hud-dec">Security</span>
                                <span className="text-sm font-black tracking-widest text-emerald-500">ENCRYPTED</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="hud-dec">Broadcast_Node</span>
                            <div className="text-sm font-black tracking-widest opacity-80" style={{ color: 'var(--text-secondary)' }}>SF_DATA_CENTER_7</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Announcer;
