import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, Shield, Cpu, Zap, Sliders } from 'lucide-react';

const SettingsPanel = ({ config, onSave, onClose }) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="relative w-full max-w-xl glass-panel p-0 overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] border-blue-500/20"
            >
                {/* Header Decoration */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />

                <div className="p-10">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-glow">
                                <Sliders className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-orbitron text-white tracking-widest leading-none mb-1">SYSTEM_CONFIG</h3>
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Access_Level: Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                                    Observation Scope
                                </label>
                                <div className="relative">
                                    <select
                                        name="scope"
                                        value={localConfig.scope}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-slate-200 font-bold appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="global" className="bg-[#0f172a]">Global Events Feed</option>
                                        <option value="org" className="bg-[#0f172a]">Organization Stream</option>
                                        <option value="repo" className="bg-[#0f172a]">Specific Repository</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                        <Sliders className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                    Telemetry Interval
                                </label>
                                <input
                                    type="number"
                                    name="refreshInterval"
                                    value={localConfig.refreshInterval}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-slate-200 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                                Neural Authorization Key
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    name="aiApiKey"
                                    value={localConfig.aiApiKey}
                                    onChange={handleChange}
                                    placeholder="Enter encrypted API signature..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-slate-200 font-mono text-sm placeholder:text-slate-700"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-500/40 uppercase group-hover:text-blue-500/80 transition-colors">Encrypted_Uplink</div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-8 py-5 rounded-2xl bg-white/5 text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/5"
                            >
                                Disconnect
                            </button>
                            <button
                                onClick={() => onSave(localConfig)}
                                className="flex-1 px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
                            >
                                <Save className="w-4 h-4" />
                                Commit Directives
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] py-4 px-10 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-30">
                        <Cpu className="w-3 h-3" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Matrix_v4.2.0</span>
                    </div>
                    <span className="text-[8px] font-black text-blue-500/30 uppercase tracking-[0.2em]">Secure_Handshake_Complete</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SettingsPanel;

