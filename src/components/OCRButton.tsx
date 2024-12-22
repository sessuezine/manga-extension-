import React, { useState } from "react";

const OCRButton = ({
    rect,
    image,
    onOCRComplete,
}: {
    rect: { x: number; y: number; width: number; height: number; orientation: "vertical" | "horizontal" } | null;
    image: File | null;
    onOCRComplete: (text: string[]) => void; // Updated to handle an array of strings
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const cropAndProcessRegion = async () => {
        if (!image || !rect) {
            alert("No region selected!");
            console.error("Image or rect is missing:", { image, rect });
            return;
        }

        console.log("Starting crop and process with rect:", rect);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }

        try {
            // Set canvas dimensions to match the cropping rectangle
            canvas.width = Math.abs(rect.width);
            canvas.height = Math.abs(rect.height);

            const img = new Image();
            img.src = URL.createObjectURL(image);
            await img.decode(); // Ensure the image is loaded before proceeding
            console.log("Image loaded successfully");

            // Draw the cropped region on the canvas
            ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);
            console.log("Cropped region drawn on canvas");

            // Convert the canvas content to a Blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to convert canvas to blob");
                    return;
                }
                console.log("Blob created successfully");

                const formData = new FormData();
                formData.append("image", blob, "processed-region.png");
                formData.append("orientation", rect.orientation); // Send orientation to backend
                console.log("Orientation sent to backend:", rect.orientation);

                try {
                    setIsLoading(true);
                    const response = await fetch("http://localhost:5001/ocr_local", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Backend error: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    console.log("Backend response received:", data);

                    if (!data.text || !Array.isArray(data.text) || data.text.length === 0) {
                        alert("No text detected in the selected region");
                        console.warn("OCR result was empty or invalid:", data);
                    } else {
                        onOCRComplete(data.text); // Pass the array of text lines directly to the callback
                    }
                } catch (error) {
                    console.error("Error communicating with the backend:", error);
                    alert("Failed to process the selected region. See console for details.");
                } finally {
                    setIsLoading(false);
                }
            });
        } catch (err) {
            console.error("Error processing the image:", err);
            alert("Error loading or processing the image. See console for details.");
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
