import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaxisService } from '../../services/taxis.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Taxi } from '../../entities/taxi.entities';

@Component({
  selector: 'app-edittaxis',
  templateUrl: './edittaxis.component.html',
  styleUrl: './edittaxis.component.css',
})
export class EdittaxisComponent implements OnInit, OnChanges {
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  @Input({ required: true }) taxi: Taxi | undefined;
  @Output() taxiChange = new EventEmitter<Taxi>();

  taxiFormGroup?: FormGroup;
  submitted = false;
  idTaxi: number;

  constructor(private taxiService: TaxisService, private fb: FormBuilder, activatedRoute: ActivatedRoute) {
    this.idTaxi = activatedRoute.snapshot.params.idtaxi;
  }

  ngOnInit(): void {
    if (this.taxi === undefined) {
      this.taxiService.getTaxi(this.idTaxi).subscribe(taxi => {
        this.loadForm(taxi);
      });
    } else {
      this.loadForm(this.taxi!);
    }
  }

  loadForm(taxi: Taxi) {
    this.taxiFormGroup = this.fb.group({
      id: [taxi.id],
      immatriculation: [taxi.immatriculation, [Validators.required, Validators.pattern('T-[A-Z]{3}-[0-9]{3}')]],
      carburant: [taxi.carburant, [Validators.required]],
      prixKm: [taxi.prixKm, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.taxi && changes.taxi.currentValue && this.taxi !== undefined) {
      this.taxi = changes.taxi.currentValue;
      this.loadForm(changes.taxi.currentValue);
    }
  }

  onUpdateTaxi(): void {
    this.submitted = true;
    if (this.taxiFormGroup?.invalid) {
      return;
    }

    this.taxiService.updateTaxi(this.taxiFormGroup?.value).subscribe(
      data => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
        this.taxiChange.emit(data);
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}
