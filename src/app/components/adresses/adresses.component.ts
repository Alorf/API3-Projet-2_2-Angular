import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { AdressesService } from '../../services/adresses.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Adresse } from '../../entities/adresse.entities';

@Component({
  selector: 'app-adresses',
  templateUrl: './adresses.component.html',
  styleUrl: './adresses.component.css',
})
export class AdressesComponent implements OnInit {
  DrawerMode = DrawerMode;

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('locationModal') locationModal!: ElementRef;

  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  drawerMode: DrawerMode = DrawerMode.add;

  adresses?: Adresse[];
  adresseSelected?: Adresse;

  isSelected: boolean = false;

  constructor(private adressesService: AdressesService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    this.adressesService.getPaginatorAdresses(0, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pageNext() {
    this.adressesService.getPaginatorAdresses(++this.page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;
      this.isButtonPreviousDisabled = false;

      if (data.last) {
        this.isButtonNextDisabled = true;
        this.isButtonPreviousDisabled = false;
      }
    });
  }

  reloadCurrentPage(page: number) {
    this.adressesService.getPaginatorAdresses(page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pagePrevious() {
    this.adressesService.getPaginatorAdresses(--this.page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;
      this.isButtonNextDisabled = false;

      if (data.first) {
        this.isButtonNextDisabled = false;
        this.isButtonPreviousDisabled = true;
      }
    });
  }

  onSearch(value: any) {
    if (value.localite === '') {
      this.alertComponent?.show(AlertType.error, 'Veuillez saisir un nom');
    } else {
      this.alertComponent?.hide();
      this.adressesService.searchAdresses(value.localite).subscribe((data: any) => {
        this.adresses = data;
      });
    }
  }

  onNewAdresse() {
    //this.router.navigateByUrl('/newAdresse');
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

  openFilterDrawer(adresse: Adresse) {
    this.drawerMode = DrawerMode.filter;
    this.adresseSelected = adresse;
    console.log('adresseSelected = ', this.adresseSelected);

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  voir() {
    alert(this.adresseSelected);
  }

  openDeleteModal(t: Adresse) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce adresse ?');
    this.adresseSelected = t;
    this.showModal();
  }

  onDelete() {
    if (this.adresseSelected === undefined) return;

    this.adressesService.deleteAdresse(this.adresseSelected).subscribe({
      next: data => {
        if (this.adresseSelected === undefined) return;
        const index = this.adresses?.indexOf(this.adresseSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Adresse ' + this.adresseSelected.cp + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.adresses?.splice(index, 1);
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

  editAdresse(c: Adresse) {
    this.drawerMode = DrawerMode.edit;
    this.adresseSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onEdit(c: Adresse) {
    this.router.navigateByUrl('/editAdresse/' + c.id);
  }
}
