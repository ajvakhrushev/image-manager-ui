import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxFilesizeModule } from 'ngx-filesize';

import { ContentTypePipe } from '../../pipes/content-type-pipe';
import { DimensionsPipe } from '../../pipes/dimensions-pipe';
import { ImagesService } from '../../services/images';
import { ImageItem } from '../../models/image-item';

@Component({
  selector: 'app-images-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    NgxFilesizeModule,
    DimensionsPipe,
    ContentTypePipe,
  ],
  templateUrl: './images-list.html',
  styleUrl: './images-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesListComponent implements OnInit {
  private readonly imagesService: ImagesService = inject(ImagesService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  readonly images = signal<ImageItem[]>([]);
  readonly isLoading = signal(false);
  readonly deletingIds = signal<Set<string>>(new Set());
  readonly isEmpty = computed(() => !this.isLoading() && this.images().length === 0);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading.set(true);

    this.imagesService.getImages$().subscribe({
      next: (items) => this.onGetImagesSuccess(items),
      error: (err) => this.onGetImagesError(err),
    });
  }

  private onGetImagesSuccess(items: ImageItem[] = []): void {
    items = items.map(next => ({
      ...next,
      name: next.originalKey?.split('/')[1] ?? '',
      originalSizeBytes: next.originalSizeBytes ?? 0,
      thumbnailSizeBytes: next.thumbnailSizeBytes ?? 0,
    }));

    this.images.set(items);
    this.isLoading.set(false);
  }

  private onGetImagesError(err: unknown): void {
    console.error(err);
    this.isLoading.set(false);
    this.snackBar.open('Failed to load images ❌', 'OK', { duration: 3000 });
  }

  delete(item: ImageItem): void {
    const { imageId, name } = item;

    if (!imageId) {
      return;
    }

    const next = new Set(this.deletingIds());

    next.add(imageId);

    this.deletingIds.set(next);

    this.imagesService.deleteImage$(imageId).subscribe({
      next: () => this.onDeleteImageSuccess(imageId, name),
      error: (err) => this.onDeleteImageError(imageId, err),
    });
  }

  private onDeleteImageSuccess(imageId: string, name: string): void {
    this.snackBar.open(`Deleted: ${name}`, 'OK', { duration: 2000 });

    this.images.set(this.images().filter((x) => x.imageId !== imageId));

    const s = new Set(this.deletingIds());

    s.delete(imageId);

    this.deletingIds.set(s);
  }

  private onDeleteImageError(imageId: string, err: unknown): void {
    console.error(err);

    this.snackBar.open('Failed to delete image ❌', 'OK', { duration: 3000 });

    const s = new Set(this.deletingIds());

    s.delete(imageId);

    this.deletingIds.set(s);
  }

  isDeleting(id: string): boolean {
    return this.deletingIds().has(id);
  }
}
