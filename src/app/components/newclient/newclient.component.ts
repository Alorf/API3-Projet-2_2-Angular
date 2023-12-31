import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';

@Component({
  selector: 'app-newclient',
  templateUrl: './newclient.component.html',
  styleUrl: './newclient.component.css',
})
export class NewclientComponent implements OnInit {
  clientFormGroup?: FormGroup;
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(private fb: FormBuilder, private clientService: ClientsService, private route: Router) {}

  ngOnInit(): void {
    this.clientFormGroup = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      mail: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required]],
    });
  }

  onSaveClient() {
    this.submitted = true;
    if (this.clientFormGroup?.invalid) {
      return;
    }

    this.clientService.save(this.clientFormGroup?.value).subscribe(
      () => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}
