import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Client } from '../../entities/clients.entities';

@Component({
  selector: 'app-editclient',
  templateUrl: './editclient.component.html',
  styleUrl: './editclient.component.css',
})
export class EditclientComponent implements OnInit, OnChanges {
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  @Input({ required: true }) client: Client | undefined;

  clientFormGroup?: FormGroup;
  submitted = false;
  idClient: number;

  constructor(private clientService: ClientsService, private fb: FormBuilder, activatedRoute: ActivatedRoute) {
    this.idClient = activatedRoute.snapshot.params.idclient;
  }

  ngOnInit(): void {
    if (this.client === undefined) {
      this.clientService.getClient(this.idClient).subscribe(client => {
        this.loadForm(client);
      });
    } else {
      this.loadForm(this.client!);
    }
  }

  loadForm(client: Client) {
    this.clientFormGroup = this.fb.group({
      id: [client.id],
      nom: [client.nom, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: [client.prenom, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      mail: [client.mail, [Validators.required, Validators.email]],
      tel: [client.tel, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    //Quand l'input change de valeur, on met a jour le formulaire. Cela ne détruit pas le composant, mais le met a jour.
    if (changes.client && changes.client.currentValue && this.client !== undefined) {
      this.client = changes.client.currentValue;
      this.loadForm(changes.client.currentValue);
    }
  }

  onUpdateClient(): void {
    this.submitted = true;
    if (this.clientFormGroup?.invalid) {
      return;
    }

    this.clientService.updateClient(this.clientFormGroup?.value).subscribe(
      data => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );

    setTimeout(() => {
      this.alertComponent?.hide();
    }, 5000);
  }
}
