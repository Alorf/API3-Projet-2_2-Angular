import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';

@Component({
  selector: 'app-newclient',
  templateUrl: './newclient.component.html',
  styleUrl: './newclient.component.css',
})
export class NewclientComponent implements OnInit {
  clientFormGroup?: FormGroup;
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(private fb: FormBuilder, private clientService: ClientsService, private router: Router) {}


  ngOnInit(): void {
    this.clientFormGroup = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      mail: ['', [Validators.required, Validators.email]],
      tel: ['+32(0) ', [Validators.required, Validators.pattern(/^\+32\(0\)\s\d{3}\s\d{2}\s\d{2}$/)]],
    });
  }

  onSaveClient() {
    this.submitted = true; 
    if (this.clientFormGroup?.invalid) { return; }
    
    this.clientService.save(this.clientFormGroup?.value).subscribe(
      () => this.alertComponent?.show("ok", "sauvegarde ok"),
      (err) => {
        this.alertComponent?.show("error", err.headers.get('error'))
      }
    );

    //route to clients
    //this.router.navigateByUrl('/client');
  }
}
