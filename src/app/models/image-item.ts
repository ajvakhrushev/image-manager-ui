export interface ImageItem {
  imageId: string;
  createdAt: string;
  status: string;
  name: string;
  originalKey?: string;
  originalUrl?: string;
  originalWidth?: number;
  originalHeight?: number;
  originalSizeBytes: number;
  originalContentType?: string;
  thumbnailKey?: string;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  thumbnailSizeBytes: number;
  thumbnailContentType?: string;
  thumbnailQuality?: number;
}
