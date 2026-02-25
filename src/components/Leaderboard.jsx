import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Users, Zap, Award, ExternalLink } from 'lucide-react';

const Leaderboard = ({ data = [] }) => {
    return (
        <div className="tech-panel p-8 h-full flex flex-col corner-tr corner-bl">
            <div className="tech-header">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 border transition-colors" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card-hover)' }}>
                        <Trophy className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Rankings</h3>
                        <div className="text-l font-bold uppercase" style={{ color: 'var(--text-primary)' }}>VELOCITY_LEADER</div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="hud-dec">Filter</span>
                    <TrendingUp className="w-4 h-4 ml-auto opacity-40" />
                </div>
            </div>

            <div className="space-y-1 flex-grow overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                    {data.length > 0 ? (
                        data.slice(0, 10).map((repo, index) => (
                            <motion.div
                                key={repo.name}
                                layout
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative flex items-center gap-4 p-3 transition-all duration-200 border-b last:border-0"
                                style={{ borderColor: 'var(--border-subtle)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Rank */}
                                <div className="w-10 h-10 flex items-center justify-center font-bold text-sm border transition-all"
                                    style={{
                                        backgroundColor: index === 0 ? 'var(--accent)' : 'transparent',
                                        color: index === 0 ? 'var(--bg-base)' :
                                            index === 1 ? 'var(--accent)' :
                                                index === 2 ? '#ff007a' : 'var(--text-muted)',
                                        borderColor: index === 0 ? 'var(--accent)' :
                                            index === 1 ? 'var(--accent)' :
                                                index === 2 ? '#ff007a' : 'var(--border-subtle)',
                                        opacity: index > 2 ? 0.6 : 1
                                    }}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="flex-grow min-w-0">
                                    <a
                                        href={`https://github.com/${repo.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-black truncate transition-colors uppercase tracking-tight block"
                                        style={{ color: 'var(--text-primary)' }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                                        onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                                    >
                                        {repo.name.split('/')[1] || repo.name}
                                    </a>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold opacity-60">
                                            <Users className="w-3 h-3" />
                                            {repo.contributors?.size || 0}
                                        </div>
                                        <div className="text-xs font-mono uppercase opacity-80" style={{ color: 'var(--text-secondary)' }}>
                                            SCR: {repo.activityScore}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20">
                            <Trophy className="w-12 h-12 mb-4 animate-pulse" style={{ color: 'var(--accent)' }} />
                            <span className="hud-dec">Scanning Nodes...</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Leaderboard;
