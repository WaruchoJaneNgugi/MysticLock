import React, { useEffect, useRef, useCallback, useState } from "react";
import {type Lockbox, SYMBOL_CONFIGS, type SymbolConfig} from "../Utils/type.ts";
import LockImage from "../assets/gems/Lock.png"; // Adjust the path to your lock image

interface LockboxCanvasProps {
    lockboxes: Lockbox[];
    gameStatus: string;
    selectedLockboxId: number | null;
    onSelectLockbox: (lockboxId: number) => void;
}

export const LockboxCanvas: React.FC<LockboxCanvasProps> = ({
                                                                lockboxes,
                                                                gameStatus,
                                                                selectedLockboxId,
                                                                onSelectLockbox,
                                                            }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>(0);
    const [hoveredLockbox, setHoveredLockbox] = useState<number | null>(null);
    const [lockImage, setLockImage] = useState<HTMLImageElement | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);



    // Load lock image
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setLockImage(img);
            setImagesLoaded(true);
        };
        img.onerror = () => {
            console.error("Failed to load lock image");
            setImagesLoaded(false);
        };
        img.src = LockImage;
    }, []);

    /** ---------- Animation Helpers ---------- **/
    const drawGlow = useCallback((
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string,
        intensity: number
    ) => {
        const gradient = ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size * 0.8
        );
        gradient.addColorStop(0, `${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, size, size);
        ctx.restore();
    }, []);

    const drawLockbox = useCallback((
        ctx: CanvasRenderingContext2D,
        box: Lockbox,
        x: number,
        y: number,
        size: number,
        time: number,
        isHovered: boolean = false
    ) => {
        const isSelected = selectedLockboxId === box.id;

        // Draw background
        ctx.save();

        // Outer glow for selected or hovered boxes
        if (isSelected || (isHovered && gameStatus === 'playing')) {
            const glowColor = isSelected ? '#FFD700' : '#00FF88';
            const pulse = Math.sin(time * 0.01) * 0.3 + 0.7;
            drawGlow(ctx, x - 15, y - 15, size + 30, glowColor, 0.4 * pulse);
        }

        // Box background with gradient
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        if (box.isRevealed) {
            gradient.addColorStop(0, '#1A1A1A');
            gradient.addColorStop(1, '#2D2D2D');
        } else {
            gradient.addColorStop(0, '#292d40');
            gradient.addColorStop(0.7, '#141621');
            gradient.addColorStop(1, '#1e2032');
        }

        ctx.fillStyle = gradient;
        ctx.strokeStyle = box.isRevealed ? '#00c3fd' : '#027da6';
        ctx.lineWidth = box.isRevealed ? 5 : 4;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner shadow
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 3, y + 3, size - 6, size - 6);

        if (!box.isRevealed) {
            // Draw lock image or fallback
            if (imagesLoaded && lockImage) {
                const lockScale = isHovered ? 1.1 : 1;
                const lockSize = size * 0.5; // Lock takes 50% of box size
                const lockX = x + (size - lockSize) / 2;
                const lockY = y + (size - lockSize) / 2;

                ctx.save();

                // Add hover scale animation
                if (isHovered) {
                    const scale = lockScale;
                    ctx.translate(lockX + lockSize/2, lockY + lockSize/2);
                    ctx.scale(scale, scale);
                    ctx.translate(-(lockX + lockSize/2), -(lockY + lockSize/2));
                }

                // Draw lock image
                ctx.drawImage(lockImage, lockX, lockY, lockSize, lockSize);

                // Add pulsing glow effect on hover
                if (isHovered && gameStatus === 'playing') {
                    const pulse = Math.sin(time * 0.01) * 0.3 + 0.7;
                    const glowColor = '#00FF88';

                    const glowGradient = ctx.createRadialGradient(
                        lockX + lockSize/2, lockY + lockSize/2, 0,
                        lockX + lockSize/2, lockY + lockSize/2, lockSize * 0.8
                    );
                    glowGradient.addColorStop(0, `${glowColor}${Math.round(pulse * 100).toString(16).padStart(2, '0')}`);
                    glowGradient.addColorStop(1, `${glowColor}00`);

                    ctx.save();
                    ctx.globalCompositeOperation = 'screen';
                    ctx.fillStyle = glowGradient;
                    ctx.fillRect(lockX, lockY, lockSize, lockSize);
                    ctx.restore();
                }

                ctx.restore();

                // Add a subtle hover highlight over the entire box
                if (isHovered && gameStatus === 'playing') {
                    ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';
                    ctx.roundRect(x, y, size, size, 15);
                    ctx.fill();
                }
            } else {
                // Fallback: draw a simple lock if image fails to load
                const lockScale = isHovered ? 1.1 : 1;
                const lockX = x + size / 2;
                const lockY = y + size / 2 + 10;

                ctx.save();
                ctx.translate(lockX, lockY);
                ctx.scale(lockScale, lockScale);
                ctx.translate(-lockX, -lockY);

                // Fallback lock drawing
                const lockGradient = ctx.createLinearGradient(lockX - 25, lockY - 20, lockX + 25, lockY + 20);
                lockGradient.addColorStop(0, isHovered ? '#00c3fd' : '#007494');
                lockGradient.addColorStop(0.5, isHovered ? '#00c3fd' : '#00c6ff');
                lockGradient.addColorStop(1, isHovered ? '#00c3fd' : '#00c6ff');

                ctx.fillStyle = lockGradient;
                ctx.beginPath();
                ctx.roundRect(lockX - 25, lockY - 20, 50, 40, 8);
                ctx.fill();

                // Lock arch
                ctx.strokeStyle = isHovered ? '#6b95e7' : '#00607c';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(lockX, lockY - 20, 25, 0, Math.PI);
                ctx.stroke();

                // Lock hole
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(lockX, lockY, 6, 0, Math.PI * 2);
                ctx.fill();

                // Shine effect
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.roundRect(lockX - 18, lockY - 12, 12, 8, 3);
                ctx.fill();

                ctx.restore();
            }

            return;
        }

        // Draw revealed symbol
        const symbolInfo: SymbolConfig | undefined = SYMBOL_CONFIGS.find(
            (s) => s.type === box.symbol
        );

        if (!symbolInfo) return;

        // Symbol background glow
        drawGlow(ctx, x, y, size, symbolInfo.color, 0.3);

        // Symbol emoji with pulsing animation
        const emojiScale = 0.8 + Math.sin(time * 0.015) * 0.25;
        const emojiX = x + size / 2;
        const emojiY = y + size / 2 - 10;

        ctx.save();
        ctx.translate(emojiX, emojiY);
        ctx.scale(emojiScale, emojiScale);
        ctx.translate(-emojiX, -emojiY);

        // Use a more reliable font stack for emojis
        const emojiFont = `bold ${size * 0.6}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`;
        ctx.font = emojiFont;
        ctx.fillStyle = symbolInfo.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = symbolInfo.color;
        ctx.shadowBlur = 25;
        ctx.fillText(symbolInfo.emoji, emojiX, emojiY);
        ctx.restore();

        // Symbol name
        ctx.font = `bold ${size * 0.14}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;
        ctx.fillText(
            symbolInfo.name,
            x + size-129,
            y + size - 35
        );

        // Multiplier
        ctx.font = `bold ${size * 0.20}px Arial`;
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;
        ctx.fillText(
            `x${box.multiplier}`,
            x + size -90,
            y + size - 10
        );

        ctx.shadowBlur = 0;

        // Highlight selected cell with rotating border
        // if (isSelected) {
        //     ctx.save();
        //     ctx.strokeStyle = '#FFD700';
        //     ctx.lineWidth = 4;
        //     ctx.shadowColor = '#FFD700';
        //     ctx.shadowBlur = 20;

            // const rotation = (time * 0.002) % (Math.PI * 2);
            // ctx.translate(x + size/2, y + size/2);
            // ctx.rotate(rotation);
            // ctx.translate(-(x + size/2), -(y + size/2));

        //     ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
        //     ctx.restore();
        // }
    }, [selectedLockboxId, gameStatus, SYMBOL_CONFIGS, drawGlow, imagesLoaded, lockImage]);

    /** ---------- Canvas Render Loop ---------- **/
    const render = useCallback((time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark background
        ctx.fillStyle = "rgba(1,23,65,0.44)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // // Subtle grid pattern in background
        // ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
        // ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw Lockboxes grid (3x3)
        const gridCols = 3;
        const gridRows = 3;
        const boxSize = Math.min(canvas.width * 0.25, 150);
        const spacing = 25;

        const totalWidth = gridCols * boxSize + (gridCols - 1) * spacing;
        const totalHeight = gridRows * boxSize + (gridRows - 1) * spacing;

        const offsetX = (canvas.width - totalWidth) / 2;
        const offsetY = (canvas.height - totalHeight) / 2;

        lockboxes.forEach((box, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const x = offsetX + col * (boxSize + spacing);
            const y = offsetY + row * (boxSize + spacing);

            const isHovered = hoveredLockbox === box.id;
            drawLockbox(ctx, box, x, y, boxSize, time, isHovered);
        });

        // Continue the animation loop
        // eslint-disable-next-line react-hooks/immutability
        animationRef.current = requestAnimationFrame(render);
    }, [lockboxes, hoveredLockbox, drawLockbox]);

    /** ---------- Mouse Handlers ---------- **/
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check lockbox hover
        const gridCols = 3;
        const gridRows = 3;
        const boxSize = Math.min(canvas.width * 0.25, 150);
        const spacing = 25;

        const totalWidth = gridCols * boxSize + (gridCols - 1) * spacing;
        const totalHeight = gridRows * boxSize + (gridRows - 1) * spacing;

        const offsetX = (canvas.width - totalWidth) / 2;
        const offsetY = (canvas.height - totalHeight) / 2;

        let foundHover = false;

        lockboxes.forEach((box, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const boxX = offsetX + col * (boxSize + spacing);
            const boxY = offsetY + row * (boxSize + spacing);

            if (x > boxX && x < boxX + boxSize && y > boxY && y < boxY + boxSize) {
                if (gameStatus === 'playing' && !box.isRevealed) {
                    canvas.style.cursor = 'pointer';
                    setHoveredLockbox(box.id);
                    foundHover = true;
                }
            }
        });

        if (!foundHover) {
            canvas.style.cursor = 'default';
            setHoveredLockbox(null);
        }
    }, [lockboxes, gameStatus]);

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameStatus !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Check lockbox clicks
        const gridCols = 3;
        const gridRows = 3;
        const boxSize = Math.min(canvas.width * 0.25, 150);
        const spacing = 25;

        const totalWidth = gridCols * boxSize + (gridCols - 1) * spacing;
        const totalHeight = gridRows * boxSize + (gridRows - 1) * spacing;

        const offsetX = (canvas.width - totalWidth) / 2;
        const offsetY = (canvas.height - totalHeight) / 2;

        lockboxes.forEach((box, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const boxX = offsetX + col * (boxSize + spacing);
            const boxY = offsetY + row * (boxSize + spacing);

            if (x > boxX && x < boxX + boxSize && y > boxY && y < boxY + boxSize) {
                if (!box.isRevealed) {
                    onSelectLockbox(box.id);
                }
                return;
            }
        });
    }, [lockboxes, gameStatus, onSelectLockbox]);

    /** ---------- Effects ---------- **/
    useEffect(() => {
        animationRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationRef.current);
    }, [render]);

    return (
        <div className="canvas-board-container">
            <canvas
                ref={canvasRef}
                width={700}
                height={600}
                className="mines-canvas"
                onMouseMove={handleCanvasMouseMove}
                onClick={handleCanvasClick}
            />
        </div>
    );
};