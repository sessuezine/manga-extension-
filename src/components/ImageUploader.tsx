import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }: { onImageUpload: (file: File) => void }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => onImageUpload(acceptedFiles[0]),
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    return (
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
            <p style={{ margin: 0 }}>Drag and drop an image here, or click to select</p>
        </div>
    );
};

export default ImageUploader;
