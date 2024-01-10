import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../entities/clients.entities';

import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { last, timeout } from 'rxjs';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { ClientSpecial } from '../tools/Enum/client-special';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  DrawerMode = DrawerMode;
  ClientSpecial = ClientSpecial;

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('locationModal') locationModal!: ElementRef;

  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  drawerMode: DrawerMode = DrawerMode.add;
  clientSpecial: ClientSpecial = ClientSpecial.Locations;

  clients?: Client[];
  clientSelected?: Client;
  /* EXAMEN */
  clientsToShow?: any[];

  isSelected: boolean = false;

  constructor(private clientsService: ClientsService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    this.clientsService.getPaginatorClients(0, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      /* Q1 EXAMEN */
      this.setKmParcouruClients(this.clients!);

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }


  /* Q1 EXAMEN */
  setKmParcouruClients(clients : Client[]){
    this.clientsToShow = clients;
    if (this.clientsToShow == undefined || this.clientsToShow.length == 0) return;

    this.clientsToShow?.forEach(element => {

      this.clientsService.getKmTotalClient(element.id).subscribe((data: any) => {
        element.kmTotal = data;
      });

    });    
  }

  pageNext() {
    this.clientsService.getPaginatorClients(++this.page, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      /* Q1 EXAMEN */
      this.setKmParcouruClients(this.clients!);

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  reloadCurrentPage(page: number = this.page) {
    this.clientsService.getPaginatorClients(page, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      /* Q1 EXAMEN */
      this.setKmParcouruClients(this.clients!);

      this.page = data.number;

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  pagePrevious() {
    this.clientsService.getPaginatorClients(--this.page, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      /* Q1 EXAMEN */
      this.setKmParcouruClients(this.clients!);

      this.isButtonNextDisabled = data.last;
      this.isButtonPreviousDisabled = data.first;
    });
  }

  onSearch(value: any) {
    if (value.nom === '') {
      this.alertComponent?.show(AlertType.error, 'Veuillez saisir un nom');
    } else {
      this.alertComponent?.hide();
      this.clientsService.searchClients(value.nom).subscribe((data: any) => {
      this.clients = data.content;
      /* Q1 EXAMEN */
      this.setKmParcouruClients(this.clients!);      });
    }
  }

  onNewClient() {
    //this.router.navigateByUrl('/newClient');
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

  openFilterDrawer(client: Client) {
    this.drawerMode = DrawerMode.filter;
    this.clientSelected = client;
    console.log('clientSelected = ', this.clientSelected);

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  voir() {
    alert(this.clientSelected);
  }

  openDeleteModal(c: Client) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce client ?');
    this.showModal();
    this.clientSelected = c;
  }

  onDelete() {
    if (this.clientSelected === undefined) return;

    this.clientsService.deleteClient(this.clientSelected).subscribe({
      next: data => {
        if (this.clientSelected === undefined) return;
        /*const index = this.clients?.indexOf(this.clientSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Client ' + this.clientSelected.nom + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.clients?.splice(index, 1);
        }*/

        this.alertComponent?.show(AlertType.ok, 'Client ' + this.clientSelected.nom + ' supprimé');
        this.reloadCurrentPage();
      },
      error: err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    });
  }

  editClient(c: Client) {
    this.drawerMode = DrawerMode.edit;
    this.clientSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onEdit(c: Client) {
    this.router.navigateByUrl('/editClient/' + c.id);
  }

  onClientEdited(client: Client) {
    console.log('client = ', client);
    console.log('this.clients = ', this.clients);

    //Change in this.clients where id = client.id
    this.clients?.find((c: Client) => {
      if (c.id === client.id) {
        c.nom = client.nom;
        c.prenom = client.prenom;
        c.mail = client.mail;
        c.tel = client.tel;
      }
    });
  }

  openSecialModal(pclientSpecial: ClientSpecial) {
    this.clientSpecial = pclientSpecial;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = false;
    }
    //Set input of app-locations

    if (this.locationModal) {
      this.locationModal.nativeElement.showModal();
    }
  }
}
