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

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const TVAnnouncement = ({ announcement, aiCommentary, isGeneratingAI }) => {
    return (
        <div className="tv-screen">
            <div className="tv-label"><span className="live-indicator"></span>LIVE</div>
            <div className="announcement-content">
                {announcement ? (
                    <div className="announcement-item">
                        <div className="announcement-event-type">
                            {getEventIcon(announcement.eventType)} {announcement.eventType.replace('Event', '')}
                        </div>
                        <div className="announcement-repo">
                            <a href={announcement.repoUrl} target="_blank" rel="noopener noreferrer">
                                {announcement.repoName}
                            </a>
                        </div>
                        <div className="announcement-time">
                            <span>👤 {announcement.actor} • {formatTime(announcement.createdAt)}</span>
                            <a href={announcement.repoUrl} className="view-link" target="_blank" rel="noopener noreferrer">
                                🔗 View
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="no-announcement">Waiting for activity...</div>
                )}
            </div>

            {aiCommentary && (
                <div className="ai-commentary">
                    <div className="ai-commentary-header">
                        🤖 AI Commentary
                    </div>
                    <div className={`ai-commentary-text ${isGeneratingAI ? 'generating' : ''}`}>
                        {isGeneratingAI ? (
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        ) : (
                            aiCommentary
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TVAnnouncement;
