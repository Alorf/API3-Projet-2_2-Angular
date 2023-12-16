import { Component, OnInit, OnChanges, Input, Output, ViewChild, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FacturesService } from '../../services/facturesService';
import { TaxisService } from '../../services/taxis.service';
import { Location } from '../../entities/location.entities';
import { Taxi } from '../../entities/taxi.entities';
import { Facture } from '../../entities/facture.entities';

@Component({
  selector: '[app-newfactures]',
  templateUrl: './newfactures.component.html',
  styleUrl: './newfactures.component.css',
})
export class NewfacturesComponent implements OnInit, OnChanges {
  factureSelect?: FormControl | undefined;
  taxis?: Taxi[];

  @Input() location?: Location;
  @Input() taxiAvailable: EventEmitter<Taxi> | undefined;

  @Output() newFacture = new EventEmitter<Facture>();

  //@ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(private fb: FormBuilder, private factureService: FacturesService, private taxisService: TaxisService) {}

  ngOnInit(): void {
    this.subscribeToParentEmitter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && changes.location.currentValue && this.location !== undefined) {
      this.location = changes.location.currentValue;
      this.loadForm();
    }
  }

  loadForm(): void {
    this.factureSelect = new FormControl('', [Validators.required]);

    this.taxisService.GetAllTaxiNotUsedInLocation(this.location!).subscribe((data: any) => {
      this.taxis = data;
      if (this.taxis!.length > 0) {
        this.factureSelect?.setValue(this.taxis![0]);
      } else {
        //Disable the select
        this.factureSelect?.disable();
      }
    });

    /*
    this.factureFormGroup = this.fb.group({
      idlocation: [this.location?.id],
      idtaxi: [this.taxis![1], [Validators.required]],
    });
    */

    //console.log(this.factureFormGroup?.value);
  }

  subscribeToParentEmitter(): void {
    this.taxiAvailable?.subscribe((data: Taxi) => {
      console.log('Taxi available');

      this.taxis?.push(data);
      this.factureSelect?.enable();
      this.factureSelect?.setValue(this.taxis![0]);

      console.log(this.taxis);
    });
  }

  onSaveFacture() {
    console.log(this.factureSelect?.value);

    this.submitted = true;
    if (this.factureSelect?.invalid || this.taxis?.length === 0) {
      return;
    }

    var bbody: any = {
      location: {
        id: this.location?.id,
      },
      taxi: {
        id: this.factureSelect?.value.id,
      },
      cout: 0,
    };

    this.factureService.save(bbody).subscribe(
      data => {
        alert('Facture ajoutée avec succès');
        this.newFacture.emit(data);
        //Delete the taxi from the list
        this.taxis = this.taxis?.filter(t => t.id !== data.taxi.id);
        if (this.taxis!.length > 0) {
          this.factureSelect?.setValue(this.taxis![0]);
        } else {
          this.factureSelect?.setValue({ immatriculation: 'Aucun taxi disponible' });

          //Disable the select
          this.factureSelect?.disable();
        }
      },
      err => {
        alert("Erreur lors de l'ajout de la facture");
      },
    );
  }
}
