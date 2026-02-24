import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Users, Zap, Award, ExternalLink } from 'lucide-react';

const Leaderboard = ({ data = [] }) => {
    return (
        <div className="glass-panel p-8 border-blue-500/10 h-full flex flex-col relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />

            <div className="flex items-center justify-between mb-10 pb-5 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 shadow-glow">
                        <Trophy className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black font-orbitron tracking-widest text-white leading-none mb-1">VELOCITY_RANKINGS</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Neural_Lead_v4</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <TrendingUp className="w-4 h-4 text-blue-500/50 mb-1" />
                    <span className="text-[8px] font-mono text-slate-600 uppercase">Real_Time</span>
                </div>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2 relative z-10">
                <AnimatePresence mode="popLayout">
                    {data.length > 0 ? (
                        data.slice(0, 10).map((repo, index) => (
                            <motion.div
                                key={repo.name}
                                layout
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                transition={{ delay: index * 0.05 }}
                                className="group/item relative flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-500"
                            >
                                {/* Rank Badge */}
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black font-mono text-lg border-2 transition-transform duration-500 group-hover/item:scale-110 ${index === 0 ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' :
                                            index === 1 ? 'bg-slate-400/10 border-slate-400 text-slate-400' :
                                                index === 2 ? 'bg-amber-600/10 border-amber-600/40 text-amber-600' :
                                                    'bg-white/5 border-white/10 text-slate-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute -top-2 -right-2 p-1 bg-blue-500 rounded-full shadow-glow">
                                            <Award className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow min-w-0">
                                    <a
                                        href={`https://github.com/${repo.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base font-black text-white truncate hover:text-blue-400 transition-colors tracking-tight uppercase flex items-center gap-2 group/link"
                                    >
                                        {repo.name.split('/')[1] || repo.name}
                                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                    </a>
                                    <div className="flex items-center gap-5 mt-2 opacity-70 group-hover/item:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                            <Users className="w-4 h-4" />
                                            {repo.contributors?.size || 0}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-mono text-blue-500 uppercase">
                                            <Zap className="w-3.5 h-3.5" />
                                            SCR: {repo.activityScore}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center opacity-10">
                            < Trophy className="w-20 h-20 mb-6 animate-pulse" />
                            <span className="font-orbitron tracking-[0.5em] text-xs uppercase">Initializing Rankings...</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Leaderboard;
