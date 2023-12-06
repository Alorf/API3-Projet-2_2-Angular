import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { TaxisService } from '../../services/taxis.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { Taxi } from '../../entities/taxi.entities';
import { AlertType } from '../tools/alert/enums/alert-type.enum';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrl: './taxis.component.css',
})
export class TaxisComponent implements OnInit {
  DrawerMode = DrawerMode;

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('locationModal') locationModal!: ElementRef;

  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  drawerMode: DrawerMode = DrawerMode.add;

  taxis?: Taxi[];
  taxiSelected?: Taxi;

  isSelected: boolean = false;

  constructor(private taxisService: TaxisService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    this.taxisService.getPaginatorTaxis(0, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pageNext() {
    this.taxisService.getPaginatorTaxis(++this.page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;
      this.isButtonPreviousDisabled = false;

      if (data.last) {
        this.isButtonNextDisabled = true;
        this.isButtonPreviousDisabled = false;
      }
    });
  }

  reloadCurrentPage(page: number) {
    this.taxisService.getPaginatorTaxis(page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pagePrevious() {
    this.taxisService.getPaginatorTaxis(--this.page, 5, 'immatriculation').subscribe((data: any) => {
      this.taxis = data.content;
      this.isButtonNextDisabled = false;

      if (data.first) {
        this.isButtonNextDisabled = false;
        this.isButtonPreviousDisabled = true;
      }
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

  openFilterDrawer(taxi: Taxi) {
    this.drawerMode = DrawerMode.filter;
    this.taxiSelected = taxi;
    console.log('taxiSelected = ', this.taxiSelected);

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  voir() {
    alert(this.taxiSelected);
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
        const index = this.taxis?.indexOf(this.taxiSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Taxi ' + this.taxiSelected.immatriculation + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.taxis?.splice(index, 1);
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

  editTaxi(c: Taxi) {
    this.drawerMode = DrawerMode.edit;
    this.taxiSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onEdit(c: Taxi) {
    this.router.navigateByUrl('/editTaxi/' + c.id);
  }
}
