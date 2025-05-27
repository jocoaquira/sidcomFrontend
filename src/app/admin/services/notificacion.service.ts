import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private countSubject = new Subject<number>();
  public count$ = this.countSubject.asObservable();

  updateCount(count: number) {
    this.countSubject.next(count);
  }
}
