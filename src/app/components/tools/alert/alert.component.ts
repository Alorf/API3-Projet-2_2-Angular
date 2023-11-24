import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  visible = "hidden";
  message = "";
  type = "ok";

  show(status:string, message: string) {
    this.type = status;
    this.message = message;
    this.visible = "";
  }

  setType(type: string) {
    this.type = type;
  }

  hide() {
    this.visible = "hidden";
  }

  changeMessage(message: string) {
    this.message = message;
  }

}
