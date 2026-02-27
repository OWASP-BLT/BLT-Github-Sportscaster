import React from 'react';

const ApiStatus = ({
    rateLimit,
    countdown,
    speed,
    onSpeedChange,
    autoProtect,
    onAutoProtectChange,
    isThrottled
}) => {
    const getProgressWidth = () => {
        // This is just for visualization, let's assume maximum speed is 60s and min is 5s
        return (countdown / speed) * 100;
    };

    const getRateClass = () => {
        if (rateLimit.remaining < 10) return 'danger';
        if (rateLimit.remaining < 30) return 'warning';
        return '';
    };

    return (
        <div className="api-status">
            <div className="api-status-header">
                <div className="rate-limit-info">
                    <div className="rate-limit-item">
                        <span className="rate-limit-label">API Requests:</span>
                        <span className={`rate-limit-value ${getRateClass()}`}>
                            {rateLimit.remaining !== null ? rateLimit.remaining : '-'}
                        </span>
                        <span className="rate-limit-label">/ </span>
                        <span className="rate-limit-value">{rateLimit.limit || '-'}</span>
                    </div>
                    <div className="rate-limit-item">
                        <span className="rate-limit-label">Resets in:</span>
                        <span className="rate-limit-value">{rateLimit.resetTime || '-'}</span>
                    </div>
                </div>
                <div className="refresh-countdown">
                    <span>Next refresh:</span>
                    <span className="countdown-value">{countdown}</span>
                    <span>s</span>
                </div>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${getProgressWidth()}%` }}
                ></div>
            </div>
            <div className="speed-control">
                <span className="speed-control-label">Refresh Speed:</span>
                <input
                    type="range"
                    className="speed-slider"
                    min="5"
                    max="60"
                    value={speed}
                    step="5"
                    onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                />
                <span className="speed-value">{speed}s</span>
                <div className="auto-protect">
                    <input
                        type="checkbox"
                        checked={autoProtect}
                        onChange={(e) => onAutoProtectChange(e.target.checked)}
                    />
                    <label className="auto-protect-label">Auto-protect</label>
                </div>
                {isThrottled && <span className="rate-protected">⚠️ Throttled</span>}
            </div>
        </div>
    );
};

export default ApiStatus;
