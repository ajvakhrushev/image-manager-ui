import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { ImageItem } from '../models/image-item';
import { UploadUrlRequest, UploadUrlResponse } from '../models/network';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly http: HttpClient = inject(HttpClient);

  getImages$(): Observable<ImageItem[]> {
    return this.http.get<{items: ImageItem[]}>(`${this.baseUrl}/images`).pipe(
      map((response) => response?.items ?? [])
    );
  }

  getUploadUrl$(payload: UploadUrlRequest): Observable<UploadUrlResponse> {
    return this.http.post<UploadUrlResponse>(`${this.baseUrl}/upload/request`, payload);
  }

  uploadFileToS3$(uploadUrl: string, file: File, contentType: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': contentType,
    });

    return this.http.put(uploadUrl, file, { headers, responseType: 'text' }).pipe(
      map(() => void 0)
    );
  }

  deleteImage$(id: string): Observable<void> {
    return this.http.delete(`${this.baseUrl}/images/${encodeURIComponent(id)}`, {
      responseType: 'text',
    }).pipe(
      map(() => void 0)
    );
  }
}
