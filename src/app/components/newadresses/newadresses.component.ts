import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-newadresses',
  templateUrl: './newadresses.component.html',
  styleUrl: './newadresses.component.css',
})
export class NewadressesComponent implements OnInit {
  adresseFormGroup?: FormGroup;
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(private fb: FormBuilder, private adressesService: AdressesService, private route: Router) {}

  ngOnInit(): void {
    this.adresseFormGroup = this.fb.group({
      rue: ['', [Validators.required]],
      num: ['', [Validators.required]],
      localite: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
    });
  }

  onSaveAdresse() {
    this.submitted = true;
    if (this.adresseFormGroup?.invalid) {
      return;
    }

    this.adressesService.save(this.adresseFormGroup?.value).subscribe(
      () => {
        console.log('adresse enregistré');

        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}
