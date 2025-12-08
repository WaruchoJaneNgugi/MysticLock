// src/components/GameHeader.tsx
import {type FC, useState} from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import {SettingsOverlay} from "./SettingsOverlay.tsx";

interface GameHeaderProps {
    balance: number;
    onMuteToggle: () => void;
    isMuted: boolean;
}

const GameHeader: FC<GameHeaderProps> = ({ balance, onMuteToggle, isMuted }) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="game-header">
            <div className="title-section">
                {/* Left: Game Title */}
                <h1 className="game-title">MysticLock</h1>

                {/* Center: Balance */}
                <div className="balance-section">
                    <span className="balance-label">BALANCE :</span>
                    <span className="balance-amount">{balance.toFixed(2)}</span>
                </div>

                {/* Right: Settings Button */}
                <div className="settings-section">
                    <button
                        className="mute-btn"
                        onClick={onMuteToggle}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button
                        className="settings-btn"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Settings Overlay */}
            {showSettings && (
                <SettingsOverlay
                    isMuted={isMuted}
                    onMuteToggle={onMuteToggle}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default GameHeader;