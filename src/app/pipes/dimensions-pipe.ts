import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dimensions',
  standalone: true
})
export class DimensionsPipe implements PipeTransform {
  transform(
    width?: number | null,
    height?: number | null,
    separator: string = '×'
  ): string {
    if (!width || !height) {
      return '-';
    }

    return `${width}${separator}${height}`;
  }
}
