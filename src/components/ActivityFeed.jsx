import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitPullRequest, Bookmark, Star, GitFork, Package, PlusCircle, Activity, Box, ExternalLink } from 'lucide-react';

const ActivityFeed = ({ events = [] }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 border transition-colors" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card-hover)' }}>
                        <Activity className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.4em] opacity-80">Data_Stream</h3>
                        <div className="text-2xl font-bold uppercase" style={{ color: 'var(--text-primary)' }}>LIVE_UPLINK</div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="hud-dec">Cache_Depth</span>
                    <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{events.length}/50</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence initial={false} mode="popLayout">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <motion.div
                                key={event.id || index}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="tech-panel p-5 flex items-center gap-5 relative opacity-90 hover:opacity-100"
                            >
                                {/* Event decoration line */}
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-20" style={{ backgroundColor: 'var(--accent)' }} />

                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 border flex items-center justify-center transition-colors" style={{ borderColor: 'var(--border-subtle)', color: 'var(--accent)', backgroundColor: 'var(--bg-card-hover)' }}>
                                        {getEventIcon(event.eventType)}
                                    </div>
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <a
                                            href={`https://github.com/${event.repoName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold truncate transition-colors uppercase tracking-tight"
                                            style={{ color: 'var(--text-primary)' }}
                                            onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                                            onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                                        >
                                            {event.repoName}
                                        </a>
                                        <span className="hud-dec text-[10px] opacity-80">
                                            {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-80" style={{ color: 'var(--text-secondary)' }}>
                                            {event.eventType.replace('Event', '')}
                                        </div>
                                        <div className="text-xs truncate breadcrumb flex items-center gap-1">
                                            <span className="opacity-60">by</span>
                                            <span className="font-bold border-b border-accent/20" style={{ color: 'var(--text-primary)' }}>@{event.actor}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 tech-panel flex flex-col items-center justify-center gap-4 border-dashed opacity-40">
                            <Box className="w-12 h-12 opacity-20" style={{ color: 'var(--accent)' }} />
                            <p className="hud-dec animate-pulse">Initializing Neural Link...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const getEventIcon = (type) => {
    const props = { size: 16, strokeWidth: 1.5 };
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
