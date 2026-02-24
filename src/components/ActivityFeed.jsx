import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitPullRequest, Bookmark, Star, GitFork, Package, PlusCircle, Activity, Box, ExternalLink } from 'lucide-react';

const ActivityFeed = ({ events = [] }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-glow">
                        <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black font-orbitron tracking-widest text-slate-300">ACTIVITY_STREAM</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Real-time Global Uplink Feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono py-1 px-3 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        CACHE: {events.length}/50
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence initial={false} mode="popLayout">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <motion.div
                                key={event.id || index}
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="glass-panel p-5 group hover:border-blue-500/30 flex items-center gap-5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <Box className="w-12 h-12 text-blue-500" />
                                </div>

                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500">
                                        {getEventIcon(event.eventType)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#020617]" />
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <a
                                            href={`https://github.com/${event.repoName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base font-black text-slate-200 truncate hover:text-blue-400 transition-colors tracking-tight flex items-center gap-2 group/link"
                                        >
                                            {event.repoName}
                                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                        <span className="text-[11px] font-mono text-slate-600 group-hover:text-blue-400/50">
                                            {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                            {event.eventType.replace('Event', '')}
                                        </div>
                                        <div className="text-[12px] text-slate-400 truncate">
                                            by <a
                                                href={`https://github.com/${event.actor}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-200 font-bold hover:text-blue-400 transition-colors"
                                            >
                                                @{event.actor}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 glass-panel flex flex-col items-center justify-center gap-6 opacity-20 border-dashed">
                            <Box className="w-16 h-16 animate-bounce" />
                            <p className="font-orbitron tracking-[0.4em] text-xs uppercase">Initializing Stream Matrix...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const getEventIcon = (type) => {
    const props = { size: 24, strokeWidth: 1.5 };
    switch (type) {
        case 'PushEvent': return <GitCommit {...props} />;
        case 'PullRequestEvent': return <GitPullRequest {...props} />;
        case 'IssuesEvent': return <Bookmark {...props} />;
        case 'WatchEvent': return <Star {...props} />;
        case 'ForkEvent': return <GitFork {...props} />;
        case 'ReleaseEvent': return <Package {...props} />;
        case 'CreateEvent': return <PlusCircle {...props} />;
        default: return <Activity {...props} />;
    }
};

export default ActivityFeed;
