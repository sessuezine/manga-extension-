import React, { useState } from "react";

const OCRButton = ({
    rect,
    image,
    onOCRComplete,
}: {
    rect: { x: number; y: number; width: number; height: number; orientation: "vertical" | "horizontal" } | null;
    image: File | null;
    onOCRComplete: (text: string) => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const cropAndProcessRegion = async () => {
        if (!image || !rect) {
            alert("No region selected!");
            console.error("Image or rect is missing:", { image, rect }); // Add this
            return;
        }

        console.log("Starting crop and process with rect:", rect); // Add this

    
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }
    
        try {
            canvas.width = Math.abs(rect.width);
            canvas.height = Math.abs(rect.height);
    
            const img = new Image();
            img.src = URL.createObjectURL(image);
            await img.decode(); // Ensure image is loaded before drawing
            console.log("Image loaded successfully");
    
            // Draw the cropped region
            ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);
            console.log("Cropped region drawn on canvas");
    
            // Convert canvas to Blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to convert canvas to blob");
                    return;
                }
                console.log("Blob created successfully:", blob);
    
                const formData = new FormData();
                formData.append("image", blob, "processed-region.png");
                formData.append("orientation", rect.orientation); // Pass orientation to backend
    
                try {
                    setIsLoading(true);
                    const response = await fetch("http://localhost:5001/ocr_local", {
                        method: "POST",
                        body: formData,
                    });
    
                    if (!response.ok) {
                        throw new Error(`Backend returned an error: ${response.status}`);
                    }
    
                    const data = await response.json();
                    console.log("Backend response:", data);
                    onOCRComplete(data.text.join(", "));
                } catch (error) {
                    console.error("Error processing the cropped region:", error);
                    alert("Failed to process the selected region");
                } finally {
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error("Error processing the image:", err);
            alert("Error loading or processing the image.");
        }
    };
    
    return (
        <button
            onClick={cropAndProcessRegion}
            disabled={isLoading}
            style={{
                padding: "0.5rem 1rem",
                backgroundColor: isLoading ? "#ccc" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "1rem",
            }}
        >
            {isLoading ? "Processing..." : "Process Selected Region"}
        </button>
    );
};

export default OCRButton;
