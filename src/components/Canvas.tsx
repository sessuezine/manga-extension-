import React, { useRef, useState, useEffect } from "react";

const Canvas = ({
    image,
    onRegionSelect,
}: {
    image: File | null;
    onRegionSelect: (rect: {
        x: number;
        y: number;
        width: number;
        height: number;
        orientation: "vertical" | "horizontal";
        characterHeight?: number | null;
    }) => void;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        setRect({ x: startX, y: startY, width: 0, height: 0 });
        setIsDrawing(true);
        console.log("Mouse down at:", { x: startX, y: startY }); // Add this
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !rect) return;
    
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const rectBounds = canvas.getBoundingClientRect();
        const currentX = e.clientX - rectBounds.left;
        const currentY = e.clientY - rectBounds.top;
    
        setRect((prev) =>
            prev
                ? {
                      ...prev,
                      width: currentX - prev.x,
                      height: currentY - prev.y,
                  }
                : null
        );
        console.log("Mouse move. Current dimensions:", { width: currentX - rect.x, height: currentY - rect.y }); // Add this
    };
    
    const handleMouseUp = () => {
        setIsDrawing(false);
        if (rect) {
            const aspectRatio = Math.abs(rect.height / rect.width);
            const orientation = aspectRatio > 1.5 ? "vertical" : "horizontal";
            console.log("Mouse up. Final rectangle:", rect); // Add this
            console.log("Orientation:", orientation); // Add this
            onRegionSelect({ ...rect, orientation });
        }
    };
    

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            if (rect) {
                console.log("Drawing rectangle:", rect);
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; // Translucent fill
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
        };
        img.onerror = () => {
            console.error("Failed to load image.");
        };
        if (image) img.src = URL.createObjectURL(image);
    }, [image, rect]);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                border: "1px solid black",
                marginTop: "1rem",
                maxWidth: "100%",
                cursor: isDrawing ? "crosshair" : "default", // Feedback cursor
            }}
        />
    );
};

export default Canvas;
