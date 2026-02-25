import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Shield, Cpu, Zap, Sliders, Terminal } from 'lucide-react';

const SettingsPanel = ({ config, onSave, onClose }) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig(prev => ({ ...prev, [name]: value }));
    };

    const inputClass = `w-full border px-5 py-4 outline-none transition-all font-mono text-sm focus:border-accent-theme`;
    const inputStyle = {
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 backdrop-blur-sm bg-black/80"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-xl tech-panel p-0 overflow-hidden corner-tl corner-br"
                style={{ backgroundColor: 'var(--bg-card)' }}
            >
                <div className="h-1 w-full" style={{ backgroundColor: 'var(--accent)' }} />

                <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 border flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)' }}>
                                <Terminal className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>SYSTEM_CONFIG</h3>
                                <p className="hud-dec">Access_Level: Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 border flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all opacity-40 hover:opacity-100"
                            style={{ borderColor: 'var(--border-subtle)' }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="hud-dec ml-1 flex items-center gap-2">
                                    <Shield className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                                    Observation Scope
                                </label>
                                <select
                                    name="scope"
                                    value={localConfig.scope}
                                    onChange={handleChange}
                                    className={inputClass}
                                    style={inputStyle}
                                >
                                    <option value="global">Global Feed</option>
                                    <option value="org">Org Stream</option>
                                    <option value="repo">Repo Native</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="hud-dec ml-1 flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-pink-500" />
                                    Refresh Rate (s)
                                </label>
                                <input
                                    type="number"
                                    name="refreshInterval"
                                    value={localConfig.refreshInterval}
                                    onChange={handleChange}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="hud-dec ml-1 flex items-center gap-2">
                                <Cpu className="w-3 h-3 text-emerald-500" />
                                Neural Authorization Key
                            </label>
                            <input
                                type="password"
                                name="aiApiKey"
                                value={localConfig.aiApiKey}
                                onChange={handleChange}
                                placeholder="ENTER_API_KEY"
                                className={inputClass}
                                style={inputStyle}
                            />
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 border text-[10px] font-black uppercase tracking-widest transition-all"
                                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                                onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                            >
                                Disconnect
                            </button>
                            <button
                                onClick={() => onSave(localConfig)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-base)' }}
                                onMouseEnter={(e) => e.target.style.opacity = 0.9}
                                onMouseLeave={(e) => e.target.style.opacity = 1}
                            >
                                Commit Directives
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-4 px-10 flex items-center justify-center border-t" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-subtle)' }}>
                    <span className="hud-dec tracking-[1em]">Secure_Link_Established</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SettingsPanel;
