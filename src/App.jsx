import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, BarChart3, Radio, Terminal } from 'lucide-react';
import Header from './components/Header';
import Announcer from './components/Announcer';
import Leaderboard from './components/Leaderboard';
import ActivityFeed from './components/ActivityFeed';
import StatusPanel from './components/StatusPanel';
import SettingsPanel from './components/SettingsPanel';
import { useGitHubSportscaster } from './hooks/useGitHubSportscaster';

function App() {
    const {
        events,
        leaderboard,
        stats,
        announcement,
        aiCommentary,
        config,
        updateConfig,
        isAIEnabled
    } = useGitHubSportscaster();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen relative font-sans selection:bg-blue-500/30 selection:text-white">
            {/* Background elements */}
            <div className="fixed inset-0 bg-grid z-0 opacity-20 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
            </div>

            <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-10 lg:py-16">
                <Header />

                <div className="mt-16 space-y-12">
                    {/* Top Section: Main Broadcast Stage */}
                    <Announcer
                        announcement={announcement}
                        aiCommentary={aiCommentary}
                        isAIEnabled={isAIEnabled}
                    />

                    {/* Bottom Section: Telemetry & Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-3 space-y-8">
                            <StatusPanel stats={stats} />
                        </div>

                        <div className="lg:col-span-6">
                            <ActivityFeed events={events} />
                        </div>

                        <div className="lg:col-span-3">
                            <Leaderboard data={leaderboard} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Global HUD Controls */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center shadow-premium hover:border-blue-500/50 transition-all group"
                >
                    <Settings className="w-6 h-6 text-slate-400 group-hover:text-blue-400 group-hover:rotate-90 transition-all duration-500" />
                </motion.button>
            </div>

            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsPanel
                        config={config}
                        onSave={(newConfig) => {
                            updateConfig(newConfig);
                            setIsSettingsOpen(false);
                        }}
                        onClose={() => setIsSettingsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Minimal Background Ticker */}
            <div className="fixed bottom-0 left-0 w-full bg-blue-600/[0.03] border-t border-white/5 py-1.5 px-6 backdrop-blur-sm z-40 overflow-hidden">
                <div className="flex items-center gap-12 animate-shimmer whitespace-nowrap">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                            <span className="text-blue-500/50">●</span>
                            GLOBAL_UPLINK_HEALTH: NOMINAL
                            <span className="text-blue-500/50">●</span>
                            BUFFER_LATENCY: {Math.floor(Math.random() * 20 + 10)}ms
                            <span className="text-blue-500/50">●</span>
                            AI_NEURAL_STABILITY: 98.4%
                            <span className="text-blue-500/50">●</span>
                            LAST_SIG_POLL: {new Date().toLocaleTimeString()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
