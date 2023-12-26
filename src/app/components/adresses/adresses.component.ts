import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { AdressesService } from '../../services/adresses.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Adresse } from '../../entities/adresse.entities';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-adresses',
  templateUrl: './adresses.component.html',
  styleUrl: './adresses.component.css',
})
export class AdressesComponent implements OnInit, OnChanges {
  DrawerMode = DrawerMode;

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('locationModal') locationModal!: ElementRef;
  @Input() client: Client | undefined;

  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  drawerMode: DrawerMode = DrawerMode.add;

  adresses?: Adresse[];
  adresseSelected?: Adresse;

  isSelected: boolean = false;

  constructor(
    private adressesService: AdressesService,
    private clientsService: ClientsService,
    private router: Router,
  ) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    if (this.client === undefined) {
      this.adressesService.getPaginatorAdresses(0, 5, 'cp').subscribe((data: any) => {
        this.adresses = data.content;
        this.page = data.number;

        this.isButtonNextDisabled = data.last;
        this.isButtonPreviousDisabled = data.first;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client && changes.client.currentValue && this.client !== undefined) {
      this.clientsService.getAdresseLocationSansDoublon(this.client).subscribe((data: any) => {
        this.adresses = data;
      });
    }
  }

  pageNext() {
    this.adressesService.getPaginatorAdresses(++this.page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  reloadCurrentPage(page: number = this.page) {
    this.adressesService.getPaginatorAdresses(page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;
      this.page = data.number;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  pagePrevious() {
    this.adressesService.getPaginatorAdresses(--this.page, 5, 'cp').subscribe((data: any) => {
      this.adresses = data.content;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
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
        /*
        const index = this.adresses?.indexOf(this.adresseSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Adresse ' + this.adresseSelected.cp + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.adresses?.splice(index, 1);
        }*/

        this.alertComponent?.show(AlertType.ok, 'Adresse ' + this.adresseSelected.cp + ' supprimé');
        this.reloadCurrentPage();
      },
      error: err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    });
  }

  editAdresse(c: Adresse) {
    this.drawerMode = DrawerMode.edit;
    this.adresseSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }
  onAdresseEdited(adresse: Adresse) {
    //Change in this.clients where id = client.id
    this.adresses?.find((a: Adresse) => {
      if (a.id === adresse.id) {
        a.cp = adresse.cp;
        a.localite = adresse.localite;
        a.rue = adresse.rue;
        a.num = adresse.num;
      }
    });
  }

  onEdit(c: Adresse) {
    this.router.navigateByUrl('/editAdresse/' + c.id);
  }
}
