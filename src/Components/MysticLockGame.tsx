import React, {useState, useCallback} from 'react';
import GameControls from './GameControls';
import GameHeader from "./GameHeader.tsx";
import {LockboxCanvas} from "./LockboxCanvas.tsx";
import {type Lockbox, type GameState, type SymbolConfig, SYMBOL_CONFIGS, INITIAL_STATE} from "../Utils/type.ts";
import {useAudioControl} from "../Hooks/useSound.ts";

// Remove "as const" and properly type as SymbolConfig[]



export const MysticLockGame: React.FC = () => {

    const [isMuted, setIsMuted] = useState(false);
    // const {playSound}=useAudioControl(isMuted,true);
    const {playSound}=useAudioControl(isMuted,true);
    // Get weighted random symbol - fix return type
    const getRandomSymbol = useCallback((): SymbolConfig => {
        const totalWeight = SYMBOL_CONFIGS.reduce((sum, symbol) => sum + symbol.rarityWeight, 0);
        let random = Math.random() * totalWeight;

        for (const symbol of SYMBOL_CONFIGS) {
            random -= symbol.rarityWeight;
            if (random <= 0) {
                return symbol;
            }
        }
        return SYMBOL_CONFIGS[0];
    }, []);

    // Initialize lockboxes (3x3 grid)
    const initializeLockboxes = useCallback((): Lockbox[] => {
        const lockboxes: Lockbox[] = [];
        const gridSize = 3;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const symbolConfig = getRandomSymbol();
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;

            lockboxes.push({
                id: i,
                x: col,
                y: row,
                symbol: symbolConfig.type,
                isRevealed: false,
                multiplier: symbolConfig.basePayout,
            });
        }
        return lockboxes;
    }, [getRandomSymbol]);
    const [gameState, setGameState] = useState<GameState>(() => {
        const initialLockboxes = initializeLockboxes();
        return {
            ...INITIAL_STATE,
            lockboxes: initialLockboxes,
        };
    });

    // Start the game (place bet)
    const startGame = useCallback(() => {
        if (gameState.balance < gameState.betAmount) return;

        const newLockboxes = initializeLockboxes();

        setGameState(prev => ({
            ...prev,
            lockboxes: newLockboxes,
            gameStatus: 'playing',
            totalWinnings: 0,
            selectedLockboxId: null,
            showPopup: false, // Hide any existing popup
            balance: prev.balance - prev.betAmount // Deduct bet
        }));

        playSound('betClickSnd');
    }, [gameState.balance, gameState.betAmount, initializeLockboxes, playSound]);

    // Select a lockbox (player makes their choice)
    const selectLockbox = useCallback((lockboxId: number) => {
        if (gameState.gameStatus !== 'playing') return;

        // Calculate winnings first to avoid stale state issues
        const selectedLockbox = gameState.lockboxes[lockboxId];
        const symbolConfig = SYMBOL_CONFIGS.find(s => s.type === selectedLockbox.symbol);
        const winnings = gameState.betAmount * (symbolConfig?.basePayout || 0);

        setGameState(prev => {
            const newLockboxes = [...prev.lockboxes];
            const lockbox = newLockboxes[lockboxId];

            if (lockbox.isRevealed) return prev;
            // Reveal the selected lockbox
            lockbox.isRevealed = true;

            return {
                ...prev,
                lockboxes: newLockboxes,
                gameStatus: 'revealed',
                selectedLockboxId: lockboxId,
                totalWinnings: winnings,
                balance: prev.balance + winnings, // Add winnings to balance
            };
        });

        // Only show popup if there are winnings
        if (winnings > 0) {
            // Show popup after 1 second delay (for animation/anticipation)
            setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    showPopup: true,
                }));
            }, 1000);

            // Auto-hide popup after 3 seconds (2 seconds visible)
            setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    showPopup: false,
                    gameStatus: 'idle',
                }));
            }, 3000);
            playSound("WinsSnd")
        } else {
            // If no winnings, just go back to idle after a short delay
            setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    gameStatus: 'idle',
                }));
            }, 1000);
        }

        playSound('cellSelectSnd');
    }, [gameState.gameStatus, gameState.lockboxes, gameState.betAmount, playSound]);

    const changeLevel = useCallback((level: 'easy' | 'medium' | 'hard') => {
        // Level doesn't affect lockbox game, but kept for compatibility
        setGameState(prev => ({
            ...prev,
            level,
            gameStatus: 'idle',
            totalWinnings: 0,
            selectedLockboxId: null,
            showPopup: false, // Hide popup when changing level
        }));
        // playSound('betClickSnd');
    }, []);

    const changeBetAmount = useCallback((amount: number) => {
        setGameState(prev => ({
            ...prev,
            betAmount: amount
        }));
        // playSound('betClickSnd');
    }, []);

    const adjustBetAmount = useCallback((increment: boolean) => {
        setGameState(prev => {
            const currentBet = prev.betAmount;
            let newBetAmount;

            if (increment) {
                newBetAmount = currentBet + 10;
            } else {
                newBetAmount = Math.max(10, currentBet - 10);
            }

            return {
                ...prev,
                betAmount: newBetAmount
            };
        });
        playSound('betClickSnd');
    }, [playSound]);

    const resetGame = useCallback(() => {
        const newLockboxes = initializeLockboxes();
        setGameState({
            ...INITIAL_STATE,
            lockboxes: newLockboxes,
            balance: 1000, // Explicitly reset balance
        });
        playSound('betClickSnd');
    }, [initializeLockboxes, playSound]);

    return (
        <div className="mines-game">
            <GameHeader
                balance={gameState.balance}
                onMuteToggle={() => setIsMuted(!isMuted)}
                isMuted={isMuted}
            />

            <div className="right-panel">
                <LockboxCanvas
                    lockboxes={gameState.lockboxes}
                    gameStatus={gameState.gameStatus}
                    selectedLockboxId={gameState.selectedLockboxId}
                    onSelectLockbox={selectLockbox}
                />

                {/* Use showPopup state to control visibility */}
                {gameState.showPopup && (
                    <div className="winning-overlay">
                        <div className="winning-message">
                            <div className="success-icon"></div>
                            <h2>You Won!</h2>
                            <p className="winning-subtitle">Great Play!</p>
                            <p className="winning-amount">+Ksh{gameState.totalWinnings.toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>

            <GameControls
                gameState={gameState}
                onStart={startGame}
                onReset={resetGame}
                onChangeLevel={changeLevel}
                onChangeBet={changeBetAmount}
                onAdjustBet={adjustBetAmount}
            />
        </div>
    );
};