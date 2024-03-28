import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MessageService } from 'ngx-i2k2-message-lib';

export interface CanComponentDeactivate {
  confirm(): boolean;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private messageService: MessageService
  ) { }

  canDeactivate(
    component: CanComponentDeactivate): boolean {
    console.log(component.confirm())
    if (!component.confirm()) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
        return true;
      } else {
        return false;
      }
    }
    else{
      return false;
    }
  }
}