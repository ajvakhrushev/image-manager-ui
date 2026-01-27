import { Component, signal } from '@angular/core';
import { UploadComponent } from './components/image-upload/image-upload';
import { ImagesListComponent } from './components/images-list/images-list';

@Component({
  selector: 'app-root',
  imports: [UploadComponent, ImagesListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('image-manager-ui');
}
