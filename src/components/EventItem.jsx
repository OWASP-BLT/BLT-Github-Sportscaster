import React from 'react';

const getEventIcon = (eventType) => {
    const icons = {
        PushEvent: '📤', PullRequestEvent: '🔀', IssuesEvent: '🐛',
        WatchEvent: '⭐', ForkEvent: '🍴', CreateEvent: '✨',
        DeleteEvent: '🗑️', ReleaseEvent: '🎉', IssueCommentEvent: '💬',
        CommitCommentEvent: '💭', PullRequestReviewEvent: '👀',
        PullRequestReviewCommentEvent: '💬', GollumEvent: '📝',
        MemberEvent: '👥', PublicEvent: '🌐'
    };
    return icons[eventType] || '📌';
};

const EventItem = ({ event, index }) => {
    return (
        <div className={`event-item stagger-in ${event.isNew ? 'new-event' : ''}`}>
            <div className="event-item-row">
                <div className="event-number">{index + 1}</div>
                <div className="event-details">
                    <div className="event-repo-name">
                        <a href={event.repoUrl} target="_blank" rel="noopener noreferrer">
                            {event.repoName}
                        </a>
                    </div>
                    <div className="event-meta">
                        <span className="event-type">{getEventIcon(event.eventType)} {event.eventType.replace('Event', '')}</span>
                        <span className="event-time">{event.actor} • {new Date(event.createdAt).toLocaleTimeString()}</span>
                    </div>
                </div>
                <div className="event-stats">
                    <div className="stat-pill">
                        <span className="stat-pill-icon">🔥</span>
                        <span className="stat-pill-value">{event.score || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;
