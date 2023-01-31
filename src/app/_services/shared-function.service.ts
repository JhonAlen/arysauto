import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedFunctionService {

  private openSignInModal = new Subject<any>();

  constructor() { }

  sendOpenSignInModalEvent() { this.openSignInModal.next(); }

  getOpenSignInModalEvent() { return this.openSignInModal.asObservable(); }
}
