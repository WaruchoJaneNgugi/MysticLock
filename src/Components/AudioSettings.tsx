// src/components/AudioSettings.tsx
import  {type FC} from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioSettingsProps {
    isMuted: boolean;
    onMuteToggle: () => void;
}

export const AudioSettings: FC<AudioSettingsProps> = ({ isMuted, onMuteToggle }) => {
    return (
        <div className="audio-settings">
            <h3 className="content-title">Audio Settings</h3>

            <div className="audio-controls">
                <button
                    className={`audio-btn ${isMuted ? 'muted' : ''}`}
                    onClick={onMuteToggle}
                >
                    {isMuted ? (
                        <>
                            <VolumeX size={24} />
                            <span>Unmute Sound</span>
                        </>
                    ) : (
                        <>
                            <Volume2 size={24} />
                            <span>Mute Sound</span>
                        </>
                    )}
                </button>

                <div className="audio-info">
                    <p>Toggle game sound effects on or off.</p>
                </div>
            </div>
        </div>
    );
};