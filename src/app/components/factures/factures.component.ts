import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';

import { FacturesService } from '../../services/facturesService';
import { Facture } from '../../entities/facture.entities';
import { Location } from '../../entities/location.entities';
import { Taxi } from '../../entities/taxi.entities';
import { TaxisService } from '../../services/taxis.service';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.css',
})
export class FacturesComponent implements OnInit, OnChanges {
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;
  @Input() location: Location | undefined;

  factures?: Facture[];
  taxis?: Taxi[];
  factureSelected?: Facture;

  isSelected: boolean = false;

  constructor(private facturesService: FacturesService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    if (this.location === undefined) return;
    this.facturesService.getPaginatorFacturesByIdLocation(this.location, 0, 5, 'cout').subscribe((data: any) => {
      this.factures = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.location && changes.location.currentValue && this.location !== undefined) {
      this.facturesService.getPaginatorFacturesByIdLocation(this.location, 0, 5, 'cout').subscribe((data: any) => {
        this.factures = data.content;
        this.page = data.number;

        if (data.last) this.isButtonNextDisabled = true;
        if (data.first) this.isButtonPreviousDisabled = true;
      });
    }
  }

  pageNext() {
    this.facturesService
      .getPaginatorFacturesByIdLocation(this.location!, ++this.page, 5, 'cout')
      .subscribe((data: any) => {
        this.factures = data.content;
        this.isButtonPreviousDisabled = false;

        if (data.last) {
          this.isButtonNextDisabled = true;
          this.isButtonPreviousDisabled = false;
        }
      });
  }

  reloadCurrentPage(page: number) {
    this.facturesService.getPaginatorFacturesByIdLocation(this.location!, page, 5, 'cout').subscribe((data: any) => {
      this.factures = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pagePrevious() {
    this.facturesService
      .getPaginatorFacturesByIdLocation(this.location!, --this.page, 5, 'cout')
      .subscribe((data: any) => {
        this.factures = data.content;
        this.isButtonNextDisabled = false;

        if (data.first) {
          this.isButtonNextDisabled = false;
          this.isButtonPreviousDisabled = true;
        }
      });
  }

  onSearch(value: any) {
    //Recherche par taxi
    if (value.immatriculation === '') {
      this.alertComponent?.show(AlertType.error, 'Veuillez saisir une immatriculation');
    } else {
      this.alertComponent?.hide();
      this.facturesService.searchFactures(value.immatriculation).subscribe((data: any) => {
        this.factures = data;
      });
    }
  }

  onNewFacture() {}

  showModal() {
    if (this.deleteModal) {
      this.deleteModal.nativeElement.showModal();
    }
  }

  openDeleteModal(c: Facture) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce facture ?');
    this.showModal();
    this.factureSelected = c;
  }

  onDelete() {
    if (this.factureSelected === undefined) return;

    this.facturesService.deleteFacture(this.factureSelected).subscribe({
      next: data => {
        if (this.factureSelected === undefined) return;
        const index = this.factures?.indexOf(this.factureSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(
          AlertType.ok,
          'Facture ' + this.factureSelected.location.id + ' ' + this.factureSelected.taxi.id + ' supprimé',
        );
        if (!(index === undefined) && index > -1) {
          this.factures?.splice(index, 1);
        }
      },
      error: err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    });
    setTimeout(() => {
      this.alertComponent?.hide();
    }, 5000);
  }

  editFacture(c: Facture) {}

  isEditing(facture: Facture) {
    this.factureSelected = facture;
  }

  foundImmatriculation(idTaxi: number) {
    return this.taxis?.find(t => t.id === idTaxi)?.immatriculation;
  }

  updateFacture() {
    console.log('update location');

    /*
    if (this.locationFormGroup?.invalid) {
      return;
    }
    */

    let body: any = {};

    this.facturesService.updateFacture(body).subscribe(
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
