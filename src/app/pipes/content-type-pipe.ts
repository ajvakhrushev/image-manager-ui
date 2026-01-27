import { Pipe, PipeTransform } from '@angular/core';

const CONTENT_TYPE_MAP: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF',
  'image/bmp': 'BMP',
  'image/tiff': 'TIFF',
  'image/svg+xml': 'SVG',
  'image/heic': 'HEIC',
  'image/heif': 'HEIF'
};

@Pipe({
  name: 'contentType',
  standalone: true
})
export class ContentTypePipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) {
      return '-';
    }

    return CONTENT_TYPE_MAP[value] ?? value.split('/')[1]?.toUpperCase() ?? value;
  }
}
