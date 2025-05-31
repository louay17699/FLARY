
export async function compressImage(file, options) {
  return new Promise((resolve, reject) => {
    if (!file.type.match('image.*')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        
        let width = img.width;
        let height = img.height;
        
        if (width > options.maxWidth) {
          height = Math.round((height * options.maxWidth) / width);
          width = options.maxWidth;
        }
        
        if (height > options.maxHeight) {
          width = Math.round((width * options.maxHeight) / height);
          height = options.maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        
        ctx.drawImage(img, 0, 0, width, height);
        
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            
           
            const compressedFile = new File([blob], file.name, {
              type: options.mimeType,
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          },
          options.mimeType,
          options.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}