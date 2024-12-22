const img = new Image();
img.crossOrigin = "anonymous";
const corsProxy = "https://cors-anywhere.herokuapp.com/";
img.src = corsProxy + target.src;


async function preprocessImage(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  // Convert to grayscale and threshold
  for (let i = 0; i < data.length; i += 4) {
    const grayscale = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const threshold = grayscale > 140 ? 255 : 0; // Adjust threshold as needed
    data[i] = data[i + 1] = data[i + 2] = threshold; // Apply binarization
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL(); // Return cleaned-up image
}



document.addEventListener('click', async (event) => {
  if (event.target.tagName === 'IMG') {
    const target = event.target;

    console.log('Image clicked:', target.src); // Log the image URL

    try {
      // Send the image URL to the Flask server for OCR
      console.log('Sending image URL to Flask server...');
      const response = await fetch("http://localhost:5000/ocr", {
        method: "POST",
        body: JSON.stringify({ image_url: target.src }), // Send the image URL in the request body
        headers: { "Content-Type": "application/json" } // Specify JSON format
      });

      const result = await response.json();
      console.log("OCR Result:", result.text); // Log the OCR result from the server

      // Display the extracted text
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = `${target.offsetTop}px`;
      overlay.style.left = `${target.offsetLeft}px`;
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.color = 'white';
      overlay.style.padding = '10px';
      overlay.style.zIndex = '9999';
      overlay.innerText = result.text.join('\n'); // Display text from the server
      document.body.appendChild(overlay);
      console.log('Text overlay added to the image.');
    } catch (err) {
      console.error("Error during OCR request:", err); // Log any errors
    }
  }
});


