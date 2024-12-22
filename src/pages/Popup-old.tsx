import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function Popup() {
    const [image, setImage] = useState<File | null>(null); // Store the uploaded image
    const [output, setOutput] = useState<string | null>(null); // Store OCR results
    const [isLoading, setIsLoading] = useState(false); // Handle loading state
    const [error, setError] = useState<string | null>(null); // Handle errors
    const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null); // Rectangle coordinates
    const [isDrawing, setIsDrawing] = useState(false); // Track if the user is drawing a rectangle

    const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas element

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file); // Set the dropped image
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    // Handle mouse down event (start drawing)
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        setRect({ x: startX, y: startY, width: 0, height: 0 });
        setIsDrawing(true);
    };

    // Handle mouse move event (update rectangle)
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
    };

    // Handle mouse up event (finish drawing)
    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // Render the image and rectangle on the canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image

            if (rect) {
                ctx.strokeStyle = "red"; // Set rectangle color
                ctx.lineWidth = 2;
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height); // Draw rectangle
            }
        };
        if (image) img.src = URL.createObjectURL(image); // Set image source
    }, [rect, image]);

    // Process the selected region
    const cropAndProcessRegion = async () => {
        if (!canvasRef.current || !rect) {
            alert("No region selected!");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Create a temporary canvas for cropping
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Set dimensions to the selected region
        tempCanvas.width = Math.abs(rect.width);
        tempCanvas.height = Math.abs(rect.height);

        // Draw the cropped region onto the temporary canvas
        tempCtx.drawImage(
            canvas,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
        );

        // Convert the cropped region to a blob
        tempCanvas.toBlob(async (blob) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append("image", blob, "cropped-region.png");

            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:5001/ocr_local", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to process the image");

                const data = await response.json();
                setOutput(data.text.join(", "));
            } catch (error) {
                console.error(error);
                setError("Failed to process the selected region");
            } finally {
                setIsLoading(false);
            }
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "1rem",
                textAlign: "center",
            }}
        >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Manga OCR</h1>

            {/* Drag-and-Drop Area */}
            <div
                {...getRootProps()}
                style={{
                    border: "2px dashed #ccc",
                    padding: "2rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    backgroundColor: isDragActive ? "#e0f7fa" : "transparent",
                    width: "300px",
                    textAlign: "center",
                }}
            >
                <input {...getInputProps()} />
                {image ? <p style={{ margin: 0 }}>{image.name}</p> : <p style={{ margin: 0 }}>Drag and drop an image here, or click to select</p>}
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    border: "1px solid black",
                    marginTop: "1rem",
                    maxWidth: "100%",
                }}
            />

            <button
                onClick={cropAndProcessRegion}
                disabled={isLoading}
                style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    marginTop: "1rem",
                }}
            >
                {isLoading ? "Processing..." : "Process Selected Region"}
            </button>

            {/* Feedback */}
            {isLoading && <p style={{ marginTop: "1rem" }}>Processing...</p>}
            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
            {output && (
                <div style={{ marginTop: "1rem", textAlign: "left" }}>
                    <h2>OCR Results</h2>
                    <p>{output}</p>
                </div>
            )}
        </div>
    );
}

export default Popup;
