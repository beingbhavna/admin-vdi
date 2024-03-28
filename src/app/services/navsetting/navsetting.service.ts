import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavsettingService {
  public filteredNav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() { }
}
