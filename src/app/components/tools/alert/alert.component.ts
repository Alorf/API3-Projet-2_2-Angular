import { Component } from '@angular/core';
import { AlertType } from './enums/alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  AlertType = AlertType;

  visible = 'hidden';
  message = '';
  type: AlertType = AlertType.ok;
  tm: any;

  show(status: AlertType, message: string, time: number = 5000) {
    console.log('show');

    this.type = status;
    this.message = message;
    this.visible = '';
    if (this.tm) {
      clearTimeout(this.tm);
    }

    this.tm = setTimeout(() => {
      this.hide();
    }, time);
  }

  setType(type: AlertType) {
    this.type = type;
  }

  hide() {
    this.visible = 'hidden';
  }

  changeMessage(message: string) {
    this.message = message;
  }
}
