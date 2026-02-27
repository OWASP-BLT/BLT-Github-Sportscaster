import React from 'react';

const CHANNEL_FILTERS = {
    all: () => true,
    hot: (e) => ['PushEvent', 'PullRequestEvent', 'ReleaseEvent'].includes(e.eventType),
    code: (e) => ['PushEvent', 'PullRequestEvent', 'CreateEvent', 'DeleteEvent'].includes(e.eventType),
    social: (e) => ['WatchEvent', 'ForkEvent', 'IssuesEvent', 'IssueCommentEvent'].includes(e.eventType)
};

const ChannelFilters = ({ events, activeChannel, onChannelChange }) => {
    const getCount = (channel) => {
        return events.filter(CHANNEL_FILTERS[channel]).length;
    };

    return (
        <div className="channel-filters">
            <span className="channel-filters-label">📺 Channels:</span>
            <span
                className={`channel-pill ${activeChannel === 'all' ? 'active' : ''}`}
                onClick={() => onChannelChange('all')}
            >
                All Activity <span className="count">{getCount('all')}</span>
            </span>
            <span
                className={`channel-pill ${activeChannel === 'hot' ? 'active' : ''}`}
                onClick={() => onChannelChange('hot')}
            >
                🔥 Hot <span className="count">{getCount('hot')}</span>
            </span>
            <span
                className={`channel-pill ${activeChannel === 'code' ? 'active' : ''}`}
                onClick={() => onChannelChange('code')}
            >
                💻 Code <span className="count">{getCount('code')}</span>
            </span>
            <span
                className={`channel-pill ${activeChannel === 'social' ? 'active' : ''}`}
                onClick={() => onChannelChange('social')}
            >
                👥 Social <span className="count">{getCount('social')}</span>
            </span>
        </div>
    );
};

export default ChannelFilters;
export { CHANNEL_FILTERS };
