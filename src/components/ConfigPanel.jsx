import React from 'react';

const ConfigPanel = ({
    visible,
    config,
    onConfigChange,
    onSave,
    onReset,
    testStatus,
    onTestConnection,
    onClose,
    onPresetSelect
}) => {
    if (!visible) return null;

    const eventTypes = [
        { id: 'all', label: 'All Events', emoji: '' },
        { id: 'PushEvent', label: 'Push', emoji: '📤' },
        { id: 'PullRequestEvent', label: 'PR', emoji: '🔀' },
        { id: 'IssuesEvent', label: 'Issues', emoji: '🐛' },
        { id: 'WatchEvent', label: 'Stars', emoji: '⭐' },
        { id: 'ForkEvent', label: 'Forks', emoji: '🍴' },
        { id: 'ReleaseEvent', label: 'Release', emoji: '🎉' }
    ];

    const presets = [
        { id: 'trending', label: 'Trending', emoji: '🔥' },
        { id: 'web', label: 'Web Dev', emoji: '🌐' },
        { id: 'ai', label: 'AI/ML', emoji: '🤖' },
        { id: 'devops', label: 'DevOps', emoji: '🔧' }
    ];

    return (
        <div className={`config-panel visible`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>⚙️ Configuration</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2em' }}>✕</button>
            </div>

            <div className="config-group">
                <label>Monitoring Scope</label>
                <select
                    value={config.scopeType}
                    onChange={(e) => onConfigChange('scopeType', e.target.value)}
                >
                    <option value="global">🌍 All GitHub</option>
                    <option value="org">🏢 Organization</option>
                    <option value="repo">📦 Repository</option>
                    <option value="user">👤 User</option>
                </select>
            </div>

            <div className="config-group">
                <label>Scope Value <small>(e.g., "facebook" or "facebook/react")</small></label>
                <input
                    type="text"
                    value={config.scopeValue}
                    onChange={(e) => onConfigChange('scopeValue', e.target.value)}
                    placeholder="Enter org, repo, or username"
                    disabled={config.scopeType === 'global'}
                />
            </div>

            <div className="config-group">
                <label>GitHub Personal Access Token <small>(Increases Rate Limit)</small></label>
                <input
                    type="password"
                    value={config.ghToken || ''}
                    onChange={(e) => onConfigChange('ghToken', e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                />
                <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '4px' }}>
                    Required for high-frequency updates (60/hr {'->'} 5000/hr).
                </p>
            </div>

            <div className="config-group">
                <label>Filter by Event Types</label>
                <div className="preset-chips">
                    {eventTypes.map(type => (
                        <span
                            key={type.id}
                            className={`preset-chip ${config.eventType === type.id ? 'active' : ''}`}
                            onClick={() => onConfigChange('eventType', type.id)}
                        >
                            {type.emoji} {type.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="config-group">
                <label>AI Commentary API (OpenAI-compatible)</label>
                <input
                    type="text"
                    value={config.aiApiUrl}
                    onChange={(e) => onConfigChange('aiApiUrl', e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                />
                <input
                    type="password"
                    value={config.aiApiKey}
                    onChange={(e) => onConfigChange('aiApiKey', e.target.value)}
                    placeholder="API Key (stored locally)"
                    style={{ marginTop: '8px' }}
                />
                <select
                    value={config.aiModel}
                    onChange={(e) => onConfigChange('aiModel', e.target.value)}
                    style={{ marginTop: '8px' }}
                >
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="o3-mini">o3-mini</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                </select>
                <div className="api-key-status">
                    <span className={`status-indicator ${testStatus.type}`}></span>
                    <span className={`status-text ${testStatus.type}`}>{testStatus.message}</span>
                </div>
                <button
                    className="config-btn test-connection-btn"
                    type="button"
                    onClick={onTestConnection}
                    disabled={testStatus.type === 'checking'}
                >
                    {testStatus.type === 'checking' ? '⌛ Testing...' : '🔌 Test Connection'}
                </button>
            </div>

            <div className="config-group">
                <label>Preset Channels</label>
                <div className="preset-chips">
                    {presets.map(preset => (
                        <span
                            key={preset.id}
                            className="preset-chip"
                            onClick={() => onPresetSelect(preset.id)}
                        >
                            {preset.emoji} {preset.label}
                        </span>
                    ))}
                </div>
            </div>

            <button className="config-btn" onClick={onSave}>Apply Configuration</button>
            <button className="config-btn secondary" onClick={onReset}>Reset to Defaults</button>
        </div>
    );
};

export default ConfigPanel;
