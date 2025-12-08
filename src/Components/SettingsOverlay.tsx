// src/components/SettingsOverlay.tsx
import  {type FC, useState} from 'react';
import { X, Book, History, Volume2, VolumeX } from 'lucide-react';
import {HowToPlay} from "./HowToPlay.tsx";
import {BetHistory} from "./BetHistory.tsx";
import {AudioSettings} from "./AudioSettings.tsx";

interface SettingsOverlayProps {
    onClose: () => void;
    isMuted:boolean;
    onMuteToggle: () => void;

}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({ onClose,isMuted,onMuteToggle }) => {
    const [activeTab, setActiveTab] = useState<'how-to-play' | 'bet-history' | 'audio'>('how-to-play');


    return (
        <div className="settings-overlay">
            <div className="settings-container">
                {/* Header */}
                <div className="settings-header">
                    <h2 className="settings-title">Game Settings</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="settings-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'how-to-play' ? 'active' : ''}`}
                        onClick={() => setActiveTab('how-to-play')}
                    >
                        <Book size={16} />
                        How to Play
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bet-history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bet-history')}
                    >
                        <History size={16} />
                        Bet History
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
                        onClick={() => setActiveTab('audio')}
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        Audio
                    </button>
                </div>

                {/* Content Area */}
                <div className="settings-content">
                    {activeTab === 'how-to-play' && <HowToPlay />}
                    {activeTab === 'bet-history' && <BetHistory />}
                    {activeTab === 'audio' && (
                        <AudioSettings
                            isMuted={isMuted}
                            onMuteToggle={onMuteToggle}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};