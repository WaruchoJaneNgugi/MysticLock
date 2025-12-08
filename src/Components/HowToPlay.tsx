// src/components/HowToPlay.tsx
import React from 'react';
import { Target, Lock, Zap, Gem, Sparkles } from 'lucide-react';

// Custom Kenya Shilling icon component
// Alternative Kenya Shilling SVG Icon
const KenyaShillingIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ fontWeight: 'bold' }}
        >
            <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="14"
                fontFamily="Arial, sans-serif"
                fill="currentColor"
            >
                KSh
            </text>
        </svg>
    );
};

export const HowToPlay: React.FC = () => {
    return (
        <div className="how-to-play">
            <h3 className="content-title">How to Play Mystic Lock</h3>

            <div className="instructions-grid">
                <div className="instruction-card">
                    <div className="instruction-icon">
                        <Target size={24} />
                    </div>
                    <h4>Objective</h4>
                    <p>Choose one lockbox from the 3x3 grid to reveal a mystical symbol and multiply your bet.</p>
                </div>

                <div className="instruction-card">
                    <div className="instruction-icon">
                        <Lock size={24} />
                    </div>
                    <h4>Lockboxes</h4>
                    <p>9 lockboxes contain different mystical symbols, each with unique payout multipliers.</p>
                </div>

                <div className="instruction-card">
                    <div className="instruction-icon">
                        <KenyaShillingIcon size={24} />
                    </div>
                    <h4>Betting</h4>
                    <p>Place your bet in KSh and click a lockbox to reveal its hidden mystical symbol and winnings.</p>
                </div>

                <div className="instruction-card">
                    <div className="instruction-icon">
                        <Zap size={24} />
                    </div>
                    <h4>Multipliers</h4>
                    <p>Each symbol has a multiplier ranging from 1x to 20x based on its rarity.</p>
                </div>

                <div className="instruction-card">
                    <div className="instruction-icon">
                        <Gem size={24} />
                    </div>
                    <h4>Symbols & Rarity</h4>
                    <p>Common: Ember Stone (1x), Tide Pearl (1.5x), Spirit Leaf (2x). Rare: Storm Rune (3x), Eternal Eye (10x). Legendary: Cosmic Fragment (20x).</p>
                </div>

                <div className="instruction-card">
                    <div className="instruction-icon">
                        <Sparkles size={24} />
                    </div>
                    <h4>Game Flow</h4>
                    <p>Bet → Choose lockbox → Reveal symbol → Collect winnings → Play again. Win popup auto-shows for 2 seconds.</p>
                </div>
            </div>

            <div className="game-rules">
                <h4>Game Rules</h4>
                <ul>
                    <li>• Place your bet amount in KSh before starting the game</li>
                    <li>• Click "Start Game" to reveal the grid of 9 lockboxes</li>
                    <li>• Select ONE lockbox by clicking on it</li>
                    <li>• The chosen lockbox reveals a mystical symbol with a multiplier</li>
                    <li>• Your winnings in KSh = Bet Amount × Symbol Multiplier</li>
                    <li>• Common symbols appear more frequently than rare ones</li>
                    <li>• Winning popup appears for 2 seconds when you win</li>
                    <li>• After revealing, click "Start Game" to play another round</li>
                    <li>• Balance updates automatically with each win</li>
                </ul>
            </div>
        </div>
    );
};