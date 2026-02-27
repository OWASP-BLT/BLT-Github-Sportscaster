import React, { useState, useMemo } from 'react';
import './App.css';
import RobotSportscaster from './components/RobotSportscaster';
import TVAnnouncement from './components/TVAnnouncement';
import EventItem from './components/EventItem';
import Leaderboard from './components/Leaderboard';
import ApiStatus from './components/ApiStatus';
import ConfigPanel from './components/ConfigPanel';
import ChannelFilters, { CHANNEL_FILTERS } from './components/ChannelFilters';
import { useSportscaster } from './hooks/useSportscaster';

function App() {
  const {
    events,
    repositories,
    announcement,
    aiCommentary,
    isGeneratingAI,
    isTalking,
    loading,
    error,
    config,
    rateLimit,
    countdown,
    speed,
    autoProtect,
    isThrottled,
    setSpeed,
    setAutoProtect,
    toggleSound,
    toggleTTS,
    toggleAI,
    applyConfig,
    selectPreset,
    getTrending,
    testAiConnection
  } = useSportscaster();

  const [configPanelVisible, setConfigPanelVisible] = useState(false);
  const [testStatus, setTestStatus] = useState({ type: 'ready', message: 'Ready to test' });
  const [localConfig, setLocalConfig] = useState(config);
  const [activeChannel, setActiveChannel] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter(CHANNEL_FILTERS[activeChannel]);
  }, [events, activeChannel]);

  const handleConfigChange = (key, value) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyConfig = () => {
    applyConfig(localConfig);
    setConfigPanelVisible(false);
  };

  const handleTestConnection = async () => {
    setTestStatus({ type: 'checking', message: 'Checking connection...' });
    const result = await testAiConnection(localConfig);
    setTestStatus({
      type: result.success ? 'connected' : 'error',
      message: result.message
    });
  };

  const handleResetConfig = () => {
    const defaults = {
      scopeType: 'global',
      scopeValue: '',
      eventType: 'all',
      ghToken: '',
      aiApiUrl: 'https://api.openai.com/v1/chat/completions',
      aiApiKey: '',
      aiModel: 'gpt-4o-mini',
      soundEnabled: true,
      ttsEnabled: false,
      aiEnabled: false
    };
    setLocalConfig(defaults);
    applyConfig(defaults);
  };

  const handlePresetSelect = (presetId) => {
    selectPreset(presetId);
    setLocalConfig(prev => ({
      ...prev,
      scopeType: 'global',
      scopeValue: '',
      eventType: 'all'
    }));
    setConfigPanelVisible(false);
  };

  return (
    <div className="App">
      <div className="top-bar">
        <a className="top-bar-btn" href="https://github.com/OWASP-BLT/Github_Sportscaster" target="_blank"
          rel="noopener noreferrer" title="View on GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <button className={`top-bar-btn ${config.soundEnabled ? 'active' : 'muted'}`} onClick={toggleSound} title="Toggle Sound Effects">
          {config.soundEnabled ? '🔊' : '🔇'}
        </button>
        <button className={`top-bar-btn ${config.ttsEnabled ? 'active' : ''}`} onClick={toggleTTS} title="Toggle Text-to-Speech">🗣️</button>
        <button className={`top-bar-btn ${config.aiEnabled ? 'active' : ''}`} onClick={toggleAI} title="Toggle AI Commentary">🤖</button>
        <button className={`top-bar-btn ${configPanelVisible ? 'active' : ''}`} onClick={() => setConfigPanelVisible(!configPanelVisible)} title="Settings">⚙️</button>
      </div>

      <ConfigPanel
        visible={configPanelVisible}
        config={localConfig}
        onConfigChange={handleConfigChange}
        onSave={handleApplyConfig}
        onReset={handleResetConfig}
        testStatus={testStatus}
        onTestConnection={handleTestConnection}
        onClose={() => setConfigPanelVisible(false)}
        onPresetSelect={handlePresetSelect}
      />

      <div className="header">
        <h1>🎙️ AI GitHub Sportscaster</h1>
        <p>Live play-by-play coverage of GitHub activity</p>
      </div>

      <div className="stats">
        <span>{events.length}</span> events processed |
        <span> {repositories.size}</span> repositories tracked |
        Last update: <span>{new Date().toLocaleTimeString()}</span>
      </div>

      <ChannelFilters
        events={events}
        activeChannel={activeChannel}
        onChannelChange={setActiveChannel}
      />

      <div className="sportscaster-section">
        <RobotSportscaster isTalking={isTalking} />
        <TVAnnouncement
          announcement={announcement}
          aiCommentary={aiCommentary}
          isGeneratingAI={isGeneratingAI}
        />
      </div>

      <Leaderboard repositories={repositories} getTrending={getTrending} />

      <ApiStatus
        rateLimit={rateLimit}
        countdown={countdown}
        speed={speed}
        onSpeedChange={setSpeed}
        autoProtect={autoProtect}
        onAutoProtectChange={setAutoProtect}
        isThrottled={isThrottled}
      />

      {loading && events.length === 0 && <div className="loading pulse">Loading GitHub activity...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="list-container">
        {filteredEvents.map((event, index) => (
          <EventItem key={event.id} event={event} index={index} />
        ))}
        {filteredEvents.length === 0 && !loading && (
          <div className="no-announcement">No matching activity found in this channel.</div>
        )}
      </div>

      <div className="refresh-info">
        Use the slider to control refresh speed | 🔊 Sound | 🗣️ Text-to-Speech | 🤖 AI Commentary | ⚙️ Settings
      </div>
    </div>
  );
}

export default App;
