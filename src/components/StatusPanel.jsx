import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, RefreshCw, Layers } from 'lucide-react';

const StatusPanel = ({ stats }) => {
    return (
        <div className="tech-panel p-8 h-full corner-tl corner-br">
            <div className="tech-header">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Telemetry</h3>
                    <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>SYSTEM_ID_09</div>
                </div>
                <Cpu className="w-5 h-5 opacity-40" />
            </div>

            <div className="space-y-8">
                <StatItem
                    label="UPLINK_COUNT"
                    value={stats.totalEvents}
                    icon={<Activity className="w-4 h-4" />}
                    color="text-accent-theme"
                    colorStyle={{ color: 'var(--accent)' }}
                />
                <StatItem
                    label="NODE_OVERFLOW"
                    value={stats.activeRepos}
                    icon={<Shield className="w-4 h-4" />}
                    color="text-emerald-500"
                />
                <StatItem
                    label="QUANTUM_DRIFT"
                    value={stats.avgScore.toFixed(1)}
                    icon={<Layers className="w-4 h-4" />}
                    color="text-pink-500"
                />

                <div className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="hud-dec">Buffer_Sync</span>
                        <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>98.4%</span>
                    </div>
                    <div className="h-0.5 w-full opacity-20" style={{ backgroundColor: 'var(--accent)' }}>
                        <motion.div
                            className="h-full shadow-glow"
                            style={{ backgroundColor: 'var(--accent)' }}
                            animate={{ width: ['90%', '98%', '90%'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ label, value, icon, color, colorStyle }) => (
    <div className="flex items-center justify-between border-b pb-2 last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
            <div className={`${color} opacity-40`} style={colorStyle}>{icon}</div>
            <span className="hud-dec">{label}</span>
        </div>
        <span className="text-sm font-bold tracking-widest" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
);

export default StatusPanel;
