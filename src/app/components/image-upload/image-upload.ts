import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import filesize from 'filesize';
import { NgxFilesizeModule } from 'ngx-filesize';
import { finalize, switchMap } from 'rxjs';

import { ImagesService } from '../../services/images';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    NgxFilesizeModule,
  ],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  private readonly imagesService: ImagesService = inject(ImagesService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  uploaded = output<void>();

  private readonly maxSizeBytes = 5 * 1024 * 1024;
  private readonly allowedTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/heic',
    'image/heif',
  ]);

  readonly selectedFile = signal<File | null>(null);
  readonly isUploading = signal(false);
  readonly fileName = computed(() => this.selectedFile()?.name ?? 'No file selected');
  readonly fileSizeBytes = computed(() => this.selectedFile()?.size ?? 0);
  readonly fileType = computed(() => this.selectedFile()?.type ?? '');

  readonly canUpload = computed(() => {
    const file = this.selectedFile();

    if (!file) {
      return false;
    }

    if (this.isUploading()) {
      return false;
    }

    if (!this.allowedTypes.has(file.type)) {
      return false;
    }

    if (file.size <= 0 || file.size > this.maxSizeBytes) {
      return false;
    }

    return true;
  });

  readonly errorText = computed(() => {
    const file = this.selectedFile();

    if (!file) {
      return null;
    }

    if (!this.allowedTypes.has(file.type)) {
      return `Unsupported format: ${file.type || 'unknown'}`;
    }

    if (file.size <= 0) {
      return 'File is empty';
    }

    if (file.size > this.maxSizeBytes) {
      return `File is too large. Max: ${filesize(this.maxSizeBytes)}`;
    }

    return null;
  });

  onPickFile(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile.set(file);

    input.value = '';
  }

  clear(): void {
    this.selectedFile.set(null);
  }

  upload(): void {
    if (!this.canUpload()) {
      this.snackBar.open('File cannot be uploaded (check type and size)', 'OK', {
        duration: 2500,
      });
      return;
    }

    const file = this.selectedFile();

    if (!file) {
      return;
    }

    this.isUploading.set(true);

    const payload = {
      fileName: file.name,
      contentType: file.type,
    };

    this.imagesService
      .getUploadUrl$(payload)
      .pipe(
        switchMap((res) => this.imagesService.uploadFileToS3$(res.uploadUrl, file, file.type)),
        finalize(() => this.isUploading.set(false))
      )
      .subscribe({
        next: () => this.onUploadFileSuccess(),
        error: (err) => this.onUploadFileError(err),
      });
  }

  private onUploadFileSuccess(): void {
    this.snackBar.open('File uploaded successfully ✅', 'OK', { duration: 2000 });
    this.clear();
    this.uploaded.emit();
  }

  private onUploadFileError(err: unknown): void {
    console.error(err);

    this.snackBar.open('Failed to upload file ❌', 'OK', { duration: 3000 });
  }
}
