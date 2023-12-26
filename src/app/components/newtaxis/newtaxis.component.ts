import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { TaxisService } from '../../services/taxis.service';

@Component({
  selector: 'app-newtaxis',
  templateUrl: './newtaxis.component.html',
  styleUrl: './newtaxis.component.css',
})
export class NewtaxisComponent implements OnInit {
  taxiFormGroup?: FormGroup;
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(private fb: FormBuilder, private taxisService: TaxisService, private route: Router) {}

  ngOnInit(): void {
    this.taxiFormGroup = this.fb.group({
      immatriculation: ['', [Validators.required, Validators.pattern('T-[A-Z]{3}-[0-9]{3}')]],
      carburant: ['', [Validators.required]],
      prixKm: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSaveTaxi() {
    this.submitted = true;
    if (this.taxiFormGroup?.invalid) {
      return;
    }

    this.taxisService.save(this.taxiFormGroup?.value).subscribe(
      () => {
        console.log('taxi enregistré');

        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}
