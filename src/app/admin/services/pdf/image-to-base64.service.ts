import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageToBase64Service {
  convertToBase64(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = imagePath;
    });
  }
}
