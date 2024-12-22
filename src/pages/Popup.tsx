import ImageUploader from "../components/ImageUploader";
import Canvas from "../components/Canvas";
import OCRButton from "../components/OCRButton";
import { useState } from "react";

function Popup() {
    const [image, setImage] = useState<File | null>(null);
    const [rect, setRect] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
        orientation: "vertical" | "horizontal";
    } | null>(null);
    const [output, setOutput] = useState<string | null>(null);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: "1rem",
            }}
        >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Manga OCR</h1>
            <ImageUploader onImageUpload={setImage} />
            <Canvas
                image={image}
                onRegionSelect={(region) => {
                    setRect(region);
                }}
            />
            <OCRButton rect={rect} image={image} onOCRComplete={setOutput} />
            {output && (
                <div style={{ marginTop: "1rem" }}>
                    <h2>OCR Results</h2>
                    <p>{output}</p>
                </div>
            )}
        </div>
    );
}

export default Popup;
