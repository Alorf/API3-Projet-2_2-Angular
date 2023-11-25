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

    show(status: AlertType, message: string) {
        this.type = status;
        this.message = message;
        this.visible = '';
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
