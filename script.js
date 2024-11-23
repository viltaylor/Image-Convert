// JavaScript for Image Converter
const upload = document.getElementById('upload');
const apply = document.getElementById('apply');
const effect = document.getElementById('effect');
const originalCanvas = document.getElementById('original');
const processedCanvas = document.getElementById('processed');
const originalCtx = originalCanvas.getContext('2d');
const processedCtx = processedCanvas.getContext('2d');

upload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      originalCanvas.width = processedCanvas.width = img.width;
      originalCanvas.height = processedCanvas.height = img.height;
      originalCtx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(file);
  }
});

apply.addEventListener('click', () => {
  const effectType = effect.value;
  const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  const pixels = imageData.data;

  if (effectType === 'grayscale') {
    for (let i = 0; i < pixels.length; i += 4) {
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
    }
  } else if (effectType === 'blur') {
    // Basic blur algorithm (box blur)
    const width = imageData.width;
    const height = imageData.height;
    const copy = new Uint8ClampedArray(pixels);

    const blurRadius = 2;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0;

        for (let dy = -blurRadius; dy <= blurRadius; dy++) {
          for (let dx = -blurRadius; dx <= blurRadius; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const offset = (ny * width + nx) * 4;
              r += copy[offset];
              g += copy[offset + 1];
              b += copy[offset + 2];
              count++;
            }
          }
        }

        const offset = (y * width + x) * 4;
        pixels[offset] = r / count;
        pixels[offset + 1] = g / count;
        pixels[offset + 2] = b / count;
      }
    }
  }

  processedCtx.putImageData(imageData, 0, 0);
});
