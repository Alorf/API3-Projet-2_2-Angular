import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-newclient',
  templateUrl: './newclient.component.html',
  styleUrl: './newclient.component.css',
})
export class NewclientComponent implements OnInit {
  clientFormGroup?: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientsService) {}

  ngOnInit(): void {
    this.clientFormGroup = this.fb.group({
      nom: null,
      prenom: null,
      mail: null,
      tel: null,
    });
  }

  onSaveClient() {
    this.clientService.save(this.clientFormGroup?.value).subscribe(
      (data) => alert('sauvegarde ok'),
      (err) => {
        alert(err.headers.get('error'));
      }
    );
  }
}
