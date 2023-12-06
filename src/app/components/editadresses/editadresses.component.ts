import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AdressesService } from '../../services/adresses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Adresse } from '../../entities/adresse.entities';

@Component({
  selector: 'app-editadresses',
  templateUrl: './editadresses.component.html',
  styleUrl: './editadresses.component.css',
})
export class EditadressesComponent implements OnInit, OnChanges {
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  @Input({ required: true }) adresse: Adresse | undefined;

  adresseFormGroup?: FormGroup;
  submitted = false;
  idAdresse: number;

  constructor(private adresseService: AdressesService, private fb: FormBuilder, activatedRoute: ActivatedRoute) {
    this.idAdresse = activatedRoute.snapshot.params.idadresse;
  }

  ngOnInit(): void {
    if (this.adresse === undefined) {
      this.adresseService.getAdresse(this.idAdresse).subscribe(adresse => {
        this.loadForm(adresse);
      });
    } else {
      this.loadForm(this.adresse!);
    }
  }

  loadForm(adresse: Adresse) {
    this.adresseFormGroup = this.fb.group({
      id: [adresse.id],
      rue: [adresse.rue, [Validators.required]],
      num: [adresse.num, [Validators.required]],
      localite: [adresse.localite, [Validators.required]],
      cp: [adresse.cp, [Validators.required, Validators.min(1000), Validators.max(9999)]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.adresse && changes.adresse.currentValue && this.adresse !== undefined) {
      this.adresse = changes.adresse.currentValue;
      this.loadForm(changes.adresse.currentValue);
    }
  }

  onUpdateAdresse(): void {
    this.submitted = true;
    if (this.adresseFormGroup?.invalid) {
      return;
    }

    this.adresseService.updateAdresse(this.adresseFormGroup?.value).subscribe(
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
