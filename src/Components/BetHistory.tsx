// src/components/BetHistory.tsx
import { Gem, Zap, Sparkles, Flame, Droplets, Leaf } from 'lucide-react';
import type { FC } from "react";
import type { SymbolType } from '../Utils/type.ts';

interface BetHistoryItem {
    id: number;
    amount: number;
    symbol: SymbolType;
    multiplier: number;
    winnings: number;
    timestamp: string;
}

export const BetHistory: FC = () => {
    // Mock data - replace with actual bet history from your state
    const betHistory: BetHistoryItem[] = [
        { id: 1, amount: 10, symbol: 'cosmic_fragment', multiplier: 20, winnings: 200, timestamp: '14:30' },
        { id: 2, amount: 10, symbol: 'eternal_eye', multiplier: 10, winnings: 100, timestamp: '14:25' },
        { id: 3, amount: 10, symbol: 'storm_rune', multiplier: 3, winnings: 30, timestamp: '14:20' },
        { id: 4, amount: 10, symbol: 'spirit_leaf', multiplier: 2, winnings: 20, timestamp: '14:15' },
        { id: 5, amount: 10, symbol: 'tide_pearl', multiplier: 1.5, winnings: 15, timestamp: '14:10' },
        { id: 6, amount: 10, symbol: 'ember_stone', multiplier: 1, winnings: 10, timestamp: '14:05' },
        { id: 7, amount: 50, symbol: 'eternal_eye', multiplier: 10, winnings: 500, timestamp: '13:45' },
        { id: 8, amount: 100, symbol: 'cosmic_fragment', multiplier: 20, winnings: 2000, timestamp: '13:30' },
    ];

    // Get icon for each symbol type
    const getSymbolIcon = (symbol: SymbolType) => {
        switch (symbol) {
            case 'ember_stone':
                return <Flame size={16} />;
            case 'tide_pearl':
                return <Droplets size={16} />;
            case 'spirit_leaf':
                return <Leaf size={16} />;
            case 'storm_rune':
                return <Zap size={16} />;
            case 'eternal_eye':
                return <Sparkles size={16} />;
            case 'cosmic_fragment':
                return <Gem size={16} />;
            default:
                return <Gem size={16} />;
        }
    };

    // Get symbol name
    const getSymbolName = (symbol: SymbolType) => {
        switch (symbol) {
            case 'ember_stone': return 'Ember Stone';
            case 'tide_pearl': return 'Tide Pearl';
            case 'spirit_leaf': return 'Spirit Leaf';
            case 'storm_rune': return 'Storm Rune';
            case 'eternal_eye': return 'Eternal Eye';
            case 'cosmic_fragment': return 'Cosmic Fragment';
            default: return 'Unknown';
        }
    };

    // Get color for each symbol type (using your symbol colors)
    const getSymbolColor = (symbol: SymbolType) => {
        switch (symbol) {
            case 'ember_stone': return '#FF6B35'; // Red-Orange
            case 'tide_pearl': return '#4A90E2'; // Blue
            case 'spirit_leaf': return '#7CB342'; // Green
            case 'storm_rune': return '#9C27B0'; // Purple
            case 'eternal_eye': return '#673AB7'; // Deep Purple
            case 'cosmic_fragment': return '#FFD700'; // Gold
            default: return '#FFFFFF';
        }
    };

    // Format date to show "Today, HH:MM" or "Yesterday, HH:MM"
    const formatDate = (timeString: string) => {
        const now = new Date();
        const [hours, minutes] = timeString.split(':');
        const betDate = new Date();
        betDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const diffInHours = (now.getTime() - betDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return `Today, ${timeString}`;
        } else if (diffInHours < 48) {
            return `Yesterday, ${timeString}`;
        } else {
            return timeString;
        }
    };

    // Get win/loss status - In Mystic Lock, all bets are wins (since you always get a symbol)
    const getResultStatus = (winnings: number, amount: number) => {
        // In Mystic Lock, winnings are always >= bet amount (since lowest multiplier is 1x)
        // But we can categorize by how big the win is
        if (winnings >= amount * 10) return 'jackpot'; // 10x or more
        if (winnings >= amount * 3) return 'big_win'; // 3x-9.99x
        if (winnings > amount) return 'win'; // More than bet (1.01x-2.99x)
        return 'even'; // Exactly bet amount (1x)
    };

    return (
        <div className="bet-history">
            <h3 className="content-title">Mystic Lock History</h3>

            {betHistory.length === 0 ? (
                <div className="empty-state">
                    <p>No lockbox history yet</p>
                    <p className="empty-subtitle">Your Mystic Lock results will appear here</p>
                </div>
            ) : (
                <div className="history-list">
                    {betHistory.map((bet) => {
                        const resultStatus = getResultStatus(bet.winnings, bet.amount);
                        const symbolColor = getSymbolColor(bet.symbol);

                        return (
                            <div
                                key={bet.id}
                                className={`history-item ${resultStatus}`}
                                style={{
                                    borderLeft: `3px solid ${symbolColor}`,
                                    borderLeftColor: symbolColor
                                }}
                            >
                                <div
                                    className="history-icon"
                                    style={{
                                        background: `${symbolColor}20`, // 20% opacity
                                        color: symbolColor
                                    }}
                                >
                                    {getSymbolIcon(bet.symbol)}
                                </div>
                                <div className="history-details">
                                    <div className="bet-info">
                                        <span className="bet-amount">ksh{bet.amount}</span>
                                        <span className="symbol-name" style={{ color: symbolColor, marginLeft: '8px', fontSize: '12px' }}>
                                            {getSymbolName(bet.symbol)}
                                        </span>
                                    </div>
                                    <div className="bet-multiplier" style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '2px' }}>
                                        ×{bet.multiplier}
                                    </div>
                                    <div className="bet-time">{formatDate(bet.timestamp)}</div>
                                </div>
                                <div className="history-result">
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: resultStatus === 'even' ? 'var(--text-secondary)' : 'var(--accent-green)'
                                    }}>
                                        +ksh{bet.winnings}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        marginTop: '2px',
                                        textAlign: 'right'
                                    }}>
                                        {resultStatus === 'jackpot' ? '🎯 JACKPOT' :
                                            resultStatus === 'big_win' ? '⚡ BIG WIN' :
                                                resultStatus === 'win' ? '✅ WIN' : '➖ EVEN'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary stats */}
            {betHistory.length > 0 && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        marginBottom: '8px'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Bets:</span>
                        <span style={{ fontWeight: 'bold' }}>{betHistory.length}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        marginBottom: '8px'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Wagered:</span>
                        <span style={{ fontWeight: 'bold' }}>
                            ksh{betHistory.reduce((sum, bet) => sum + bet.amount, 0)}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '14px'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Winnings:</span>
                        <span style={{
                            fontWeight: 'bold',
                            color: 'var(--accent-green)'
                        }}>
                            +ksh{betHistory.reduce((sum, bet) => sum + bet.winnings, 0)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};