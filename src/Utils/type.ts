export type SymbolType = 'null_core'|'ember_stone' | 'tide_pearl' | 'spirit_leaf' | 'storm_rune' | 'eternal_eye' | 'cosmic_fragment';

export type SymbolConfig ={
    type: SymbolType;
    name: string;
    emoji: string;
    basePayout: number;
    color: string;
    effect?: string;
    rarityWeight: number;
}

export type Lockbox ={
    id: number;
    x: number;
    y: number;
    symbol: SymbolType | null;
    isRevealed: boolean;
    multiplier: number;
    isSelected?: boolean;
}

export type GameState ={
    lockboxes: Lockbox[];
    balance: number;
    betAmount: number;
    totalWinnings: number;
    gameStatus: 'idle' | 'betting' | 'playing' | 'revealing' | 'revealed' | 'win' | 'lose';
    level: 'easy' | 'medium' | 'hard';
    selectedLockboxId: number | null;
    showPopup:boolean;
}

// Keep old Cell interface for compatibility if needed
export interface Cell {
    x: number;
    y: number;
    isBomb: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
}

export const SYMBOL_CONFIGS: SymbolConfig[] = [
    {
        type: 'null_core',
        name: 'Null Core',
        emoji: '⚫',
        basePayout: 0,
        color: '#2C3E50',
        rarityWeight: 50
    },
    {
        type: 'ember_stone',
        name: 'Ember Stone',
        emoji: '🔥',
        basePayout: 1,
        color: '#FF6B35',
        rarityWeight: 30
    },
    {
        type: 'tide_pearl',
        name: 'Tide Pearl',
        emoji: '💧',
        basePayout: 1.5,
        color: '#4A90E2',
        rarityWeight: 25
    },
    {
        type: 'spirit_leaf',
        name: 'Spirit Leaf',
        emoji: '🌿',
        basePayout: 2,
        color: '#7CB342',
        rarityWeight: 20
    },
    {
        type: 'storm_rune',
        name: 'Storm Rune',
        emoji: '⚡',
        basePayout: 3,
        color: '#9C27B0',
        rarityWeight: 15,
        effect: 'bonus_chance'
    },
    {
        type: 'eternal_eye',
        name: 'Eternal Eye',
        emoji: '🔮',
        basePayout: 10,
        color: '#673AB7',
        rarityWeight: 8,
        effect: 'trigger_bonus'
    },
    {
        type: 'cosmic_fragment',
        name: 'Cosmic Fragment',
        emoji: '⭐',
        basePayout: 20,
        color: '#FFD700',
        rarityWeight: 2,
        effect: 'jackpot'
    },
];

export const INITIAL_STATE: GameState = {
    lockboxes: [],
    balance: 1000,
    betAmount: 10,
    totalWinnings: 0,
    gameStatus: 'idle',
    level: 'easy',
    selectedLockboxId: null,
    showPopup: false,
};