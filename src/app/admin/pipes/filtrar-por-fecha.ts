// src/app/pipes/filter-by-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDate',
  pure: false // Pure: false si la data de entrada cambia con frecuencia y quieres re-ejecutar el pipe
})
export class FilterByDatePipe implements PipeTransform {
  transform(items: any[], date: Date, dateProperty: string): any[] {
    if (!items || !date) {
      return [];
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return items.filter(item => {
      const itemDate = new Date(item[dateProperty]);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === targetDate.getTime();
    });
  }
}
