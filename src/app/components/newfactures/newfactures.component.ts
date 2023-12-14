import { Component, OnInit, OnChanges, Input, Output, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacturesService } from '../../services/facturesService';
import { TaxisService } from '../../services/taxis.service';
import { Location } from '../../entities/location.entities';
import { Taxi } from '../../entities/taxi.entities';

@Component({
  selector: '[app-newfactures]',
  templateUrl: './newfactures.component.html',
  styleUrl: './newfactures.component.css',
})
export class NewfacturesComponent implements OnInit, OnChanges {
  factureFormGroup?: FormGroup;
  taxis?: Taxi[];

  @Input() location?: Location;

  //@Output() newFacture = new EventEmitter<Facture>();
  //@ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private factureService: FacturesService,
    private taxisService: TaxisService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && changes.location.currentValue && this.location !== undefined) {
      this.location = changes.location.currentValue;
      this.loadForm();
    }
  }

  loadForm(): void {

    this.taxisService.getAllTaxis().subscribe((data: any) => {
      this.taxis = data;
    });

    this.factureFormGroup = this.fb.group({
      idlocation: [this.location?.id],
      idtaxi: ['1', [Validators.required]],
    });

    console.log(this.factureFormGroup?.value);
    
  }

  onSaveFacture() {
    /*
    this.submitted = true;
    if (this.factureFormGroup?.invalid) {
      return;
    }

    var body: any = {
      dateloc: this.factureFormGroup?.value.dateloc,
      kmTotal: this.factureFormGroup?.value.kmTotal,
      location: {
        id: this.location === undefined ? this.factureFormGroup?.value.idlocation : this.location.id,
      },
      adrDepart: {
        id: this.factureFormGroup?.value.idadresse,
      },
    };

    this.factureService.save(body).subscribe(
      data => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
        setTimeout(() => {
          this.alertComponent?.hide();
        }, 5000);
        this.newFacture.emit(data);
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
    */
  }
}
