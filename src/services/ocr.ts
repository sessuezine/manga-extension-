export async function processImage(image: string): Promise<string> {
    const response = await fetch("http://localhost:5000/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });
  
    if (!response.ok) throw new Error("Failed to process image");
  
    const data = await response.json();
    return data.text; // Adjust based on your server's response format
  }
  