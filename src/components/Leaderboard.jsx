import React from 'react';

const Leaderboard = ({ repositories, getTrending }) => {
    const sortedRepos = [...repositories.values()]
        .sort((a, b) => b.activityScore - a.activityScore)
        .slice(0, 10);

    const getRankClass = (index) => {
        if (index === 0) return 'rank-1';
        if (index === 1) return 'rank-2';
        if (index === 2) return 'rank-3';
        return '';
    };

    const getRankLabelClass = (index) => {
        if (index === 0) return 'gold';
        if (index === 1) return 'silver';
        if (index === 2) return 'bronze';
        return '';
    };

    const getRankEmoji = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    return (
        <div className="leaderboard-section">
            <div className="leaderboard-header">
                <div className="leaderboard-title">🏆 Activity Leaderboard</div>
            </div>
            <div className="leaderboard-list">
                {sortedRepos.map((repo, index) => {
                    const trending = getTrending(repo.name, index + 1);
                    return (
                        <div key={repo.name} className={`leaderboard-item ${getRankClass(index)}`}>
                            <div className={`leaderboard-rank ${getRankLabelClass(index)}`}>
                                {getRankEmoji(index)}
                            </div>
                            <div className="leaderboard-repo">
                                <div className="leaderboard-repo-name">
                                    <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer">
                                        {repo.name}
                                    </a>
                                </div>
                                <div className="leaderboard-stats">
                                    <div className="leaderboard-stat">
                                        <span>⚡ {repo.activityScore}</span>
                                    </div>
                                    <div className="leaderboard-stat">
                                        <span>📊 {repo.totalEvents}</span>
                                    </div>
                                    <div className="leaderboard-stat">
                                        <span>👥 {repo.contributors.size}</span>
                                    </div>
                                </div>
                            </div>
                            {trending && (
                                <div className={`leaderboard-change ${trending.type}`}>
                                    {trending.icon} {trending.text}
                                </div>
                            )}
                        </div>
                    );
                })}
                {sortedRepos.length === 0 && (
                    <div className="no-announcement">No active repositories yet</div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
