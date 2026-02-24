import React from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, Cpu, Wifi, BarChart3, Clock } from 'lucide-react';

const StatusPanel = ({ stats }) => {
    return (
        <div className="glass-panel p-10 border-blue-500/10 h-full flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10 pb-5 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Cpu className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black font-orbitron tracking-widest text-white leading-none mb-1">NODE_TELEMETRY</h3>
                        <p className="text-[11px] font-mono text-slate-500 uppercase">System_Hardware_Log</p>
                    </div>
                </div>
                <div className="animate-pulse flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-emerald-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
            </div>

            <div className="space-y-12 py-4">
                <StatItem
                    icon={<Database className="w-6 h-6" />}
                    label="Uplink Density"
                    value={stats.totalEvents}
                    subvalue="Pkts Processed"
                    color="text-blue-400"
                    progress={Math.min((stats.totalEvents / 1000) * 100, 100)}
                />
                <StatItem
                    icon={<Activity className="w-6 h-6" />}
                    label="Active Nodes"
                    value={stats.activeRepos}
                    subvalue="Tracked Repos"
                    color="text-indigo-400"
                    progress={Math.min((stats.activeRepos / 20) * 100, 100)}
                />
                <StatItem
                    icon={<BarChart3 className="w-6 h-6" />}
                    label="Stream Velocity"
                    value={stats.avgScore?.toFixed(1) || '0.0'}
                    subvalue="Avg Momentum"
                    color="text-sky-400"
                    progress={(stats.avgScore / 100) * 100 || 0}
                />
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase">Uptime</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400 tracking-wider">04:22:12:09</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase">Load</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400 tracking-wider">0.42%</span>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value, subvalue, color, progress }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`${color} opacity-40`}>{icon}</div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-right">
                <div className={`text-2xl font-black font-orbitron ${color} tracking-tighter leading-none`}>{value}</div>
                <div className="text-[10px] font-mono text-slate-600 uppercase mt-2">{subvalue}</div>
            </div>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`absolute h-full inset-y-0 left-0 bg-gradient-to-r from-transparent to-current opacity-50 ${color}`}
            />
            <div className={`h-full bg-current opacity-20 transition-all duration-1000 ${color}`} style={{ width: `${progress}%` }} />
        </div>
    </div>
);

export default StatusPanel;
