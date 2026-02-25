import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import Header from './components/Header';
import Announcer from './components/Announcer';
import Leaderboard from './components/Leaderboard';
import ActivityFeed from './components/ActivityFeed';
import StatusPanel from './components/StatusPanel';
import SettingsPanel from './components/SettingsPanel';
import { useGitHubSportscaster } from './hooks/useGitHubSportscaster';

const TICKER_ITEMS = [
    'SYSTEM_STATUS: NOMINAL',
    'UPLINK_STABILITY: 100%',
    'NEURAL_LINK: ACTIVE',
    'ENCRYPTION: AES-256',
    'LATENCY: 12MS',
    'COORDINATES: 37.7749° N, 122.4194° W',
    'PROTOCOL: v4.2.0-BETA',
];

function App() {
    const {
        events,
        leaderboard,
        stats,
        announcement,
        aiCommentary,
        config,
        updateConfig,
        isAIEnabled,
        isTTSEnabled,
        isSoundEnabled,
        toggleSound,
        isSpeaking,
        mouthOpenLevel,
    } = useGitHubSportscaster();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('sc-theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sc-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <div className="min-h-screen relative font-mono" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            {/* Background elements */}
            <div className="fixed inset-0 bg-grid z-0 opacity-100 pointer-events-none" />

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 py-10 pb-24">
                <Header />

                <div className="mt-12 space-y-12">
                    {/* Top Section: Main Broadcast Stage */}
                    <Announcer
                        announcement={announcement}
                        aiCommentary={aiCommentary}
                        isAIEnabled={isAIEnabled}
                        isSpeaking={isSpeaking}
                        mouthOpenLevel={mouthOpenLevel}
                    />

                    {/* Bottom Section: Telemetry & Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-3">
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
            <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-6">
                {/* Audio Toggle (Critical for initializing AudioContext) */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSound}
                    className="w-14 h-14 border flex items-center justify-center shadow-glow group relative transition-all"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    title={isSoundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                >
                    <div className="absolute inset-0 border-t-2 border-l-2 w-2 h-2 -top-0.5 -left-0.5" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute inset-0 border-b-2 border-r-2 w-2 h-2 -bottom-0.5 -right-0.5 ml-auto mt-auto" style={{ borderColor: 'var(--accent)' }} />
                    {isSoundEnabled ? (
                        <Volume2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    ) : (
                        <VolumeX className="w-6 h-6 opacity-40" />
                    )}
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="w-14 h-14 border flex items-center justify-center shadow-glow group relative transition-all"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                    <div className="absolute inset-0 border-t-2 border-l-2 w-2 h-2 -top-0.5 -left-0.5" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute inset-0 border-b-2 border-r-2 w-2 h-2 -bottom-0.5 -right-0.5 ml-auto mt-auto" style={{ borderColor: 'var(--accent)' }} />
                    {theme === 'dark' ? (
                        <Sun className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    ) : (
                        <Moon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    )}
                </motion.button>

                {/* Settings */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-14 h-14 border flex items-center justify-center shadow-glow group relative transition-all"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                    <div className="absolute inset-0 border-t-2 border-l-2 w-2 h-2 -top-0.5 -left-0.5" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute inset-0 border-b-2 border-r-2 w-2 h-2 -bottom-0.5 -right-0.5 ml-auto mt-auto" style={{ borderColor: 'var(--accent)' }} />
                    <Settings className="w-6 h-6 group-hover:rotate-90 transition-all duration-500" style={{ color: 'var(--accent)' }} />
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

            {/* Bottom Ticker */}
            <div className="fixed bottom-0 left-0 w-full py-3 px-0 z-40 overflow-hidden border-t" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <div className="ticker-track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 mx-8 text-[10px] font-mono uppercase tracking-[0.4em] opacity-60 whitespace-nowrap">
                            <span style={{ color: 'var(--accent)' }}>■</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
