import React from 'react';
import type {GameState} from "../Utils/type.ts";

interface GameControlsProps {
    gameState: GameState;
    onStart: () => void;
    // onCashOut: () => void;
    onReset: () => void;
    onChangeLevel: (level: 'easy' | 'medium' | 'hard') => void;
    onChangeBet: (amount: number) => void;
    onAdjustBet: (increment: boolean) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
                                                       gameState,
                                                       onStart,
                                                       // onCashOut,
                                                       // onReset,
                                                       // onChangeLevel,
                                                       onChangeBet,
                                                       onAdjustBet
                                                   }) => {
    const betAmounts = [10, 50, 100, 250, 500];

    // Calculate potential payout based on selected lockbox (if any)
    // const getPotentialPayout = () => {
    //     if (gameState.selectedLockboxId !== null) {
    //         const selectedBox = gameState.lockboxes.find(box => box.id === gameState.selectedLockboxId);
    //         if (selectedBox && selectedBox.isRevealed) {
    //             return gameState.betAmount * selectedBox.multiplier;
    //         }
    //     }
    //     return gameState.totalWinnings;
    // };
    //
    // // Check if cash out is available (only when a lockbox is revealed)
    // const canCashOut = () => {
    //     return gameState.gameStatus === 'revealed' && gameState.selectedLockboxId !== null;
    // };
    //
    // // Check if start is available
    // const canStart = () => {
    //     return gameState.gameStatus === 'idle' || gameState.gameStatus === 'betting';
    // };

    return (
        <div className="game-controls">
            <div className="control-section">
                <div className="section-title">Bet Amount</div>
                <div className="main-bet-amounts">
                    <div className="bet-amount-selector">
                        {betAmounts.map(amount => (
                            <div
                                key={amount}
                                className={`bet-amount-btn ${gameState.betAmount === amount ? 'active' : ''}`}
                                onClick={() => onChangeBet(amount)}
                                title={`Bet $${amount}`}
                            >
                                {amount}
                            </div>
                        ))}
                    </div>
                    <div className="bet-adjuster">
                        <div
                            className="bet-adjust-btn"
                            onClick={() => onAdjustBet(false)}
                            title="Decrease bet"
                        >
                            -
                        </div>
                        <div className="current-bet">Ksh{gameState.betAmount}</div>
                        <div
                            className="bet-adjust-btn"
                            onClick={() => onAdjustBet(true)}
                            title="Increase bet"
                        >
                            +
                        </div>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                {(() => {
                    switch (gameState.gameStatus) {
                        case 'playing':
                            return (
                                // add styles to this
                                <button
                                    className="action-btn start-btn"
                                    // onClick={onStart}
                                    // disabled={gameState.balance < gameState.betAmount}
                                >
                                    ....
                                </button>
                            );

                        case 'idle':
                        case 'betting':
                        case 'revealed':
                        case 'win':
                        case 'lose':
                        default:
                            return (
                                <button
                                    className="action-btn start-btn"
                                    onClick={onStart}
                                    disabled={gameState.balance < gameState.betAmount}
                                >
                                    START GAME
                                </button>
                            );
                    }
                })()}
            </div>
        </div>
    );
};

export default GameControls;