import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { TaxisService } from '../../services/taxis.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { Taxi } from '../../entities/taxi.entities';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrl: './taxis.component.css',
})
export class TaxisComponent implements OnInit, OnChanges {
  DrawerMode = DrawerMode;

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('locationModal') locationModal!: ElementRef;
  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;
  @Input() client: Client | undefined;

  drawerMode: DrawerMode = DrawerMode.add;

  taxis?: Taxi[];
  taxiSelected?: Taxi;

  isSelected: boolean = false;

  constructor(private taxisService: TaxisService, private clientsService: ClientsService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    if (this.client === undefined) {
      this.taxisService.getPaginatorTaxis(0, 5, 'immatriculation').subscribe((data: any) => {
        console.log('data = ', data);

        this.taxis = data.content;
        this.page = data.number;

        this.isButtonNextDisabled = data.last;
        this.isButtonPreviousDisabled = data.first;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client && changes.client.currentValue && this.client !== undefined) {
      this.clientsService.getTaxisSansDoublon(this.client!).subscribe((data: any) => {
        this.taxis = data;
      });
    }
  }

  pageNext() {
    this.taxisService.getPaginatorTaxis(++this.page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  reloadCurrentPage(page: number = this.page) {
    this.taxisService.getPaginatorTaxis(page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;
      this.page = data.number;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  pagePrevious() {
    this.taxisService.getPaginatorTaxis(--this.page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  onSearch(value: any) {
    //todo : refaire la recherche
    console.log('value = ', value);
    if (value.immatriculation === '') {
      this.alertComponent?.show(AlertType.error, 'Veuillez saisir une immatriculation');
    } else {
      console.log('taxis = ', this.taxis);
      this.alertComponent?.hide();
      this.taxisService.searchTaxis(value.immatriculation).subscribe((data: any) => {
        if (data === null) {
          this.taxis = [];
          return;
        }

        this.taxis = [];
        this.taxis?.push(data);
        console.log('taxis = ', this.taxis);
      });
    }
  }

  onNewTaxi() {
    //this.router.navigateByUrl('/newTaxi');
    this.drawerMode = DrawerMode.add;
    // Open the drawer
    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  showModal() {
    if (this.deleteModal) {
      this.deleteModal.nativeElement.showModal();
    }
  }

  openDeleteModal(t: Taxi) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce taxi ?');
    this.taxiSelected = t;
    this.showModal();
  }

  onDelete() {
    if (this.taxiSelected === undefined) return;

    this.taxisService.deleteTaxi(this.taxiSelected).subscribe({
      next: data => {
        if (this.taxiSelected === undefined) return;
        /*const index = this.taxis?.indexOf(this.taxiSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Taxi ' + this.taxiSelected.immatriculation + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.taxis?.splice(index, 1);
        }*/

        this.alertComponent?.show(AlertType.ok, 'Taxi ' + this.taxiSelected.immatriculation + ' supprimé');
        this.reloadCurrentPage();
      },
      error: err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    });
  }

  editTaxi(c: Taxi) {
    this.drawerMode = DrawerMode.edit;
    this.taxiSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onTaxiEdited(taxi: Taxi) {
    //Change in this.clients where id = client.id
    this.taxis?.find((t: Taxi) => {
      if (t.id === taxi.id) {
        t.immatriculation = taxi.immatriculation;
        t.carburant = taxi.carburant;
        t.prixKm = taxi.prixKm;
      }
    });
  }

  onEdit(c: Taxi) {
    this.router.navigateByUrl('/editTaxi/' + c.id);
  }
}
