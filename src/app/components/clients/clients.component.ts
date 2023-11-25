import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { last, timeout } from 'rxjs';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  clients?: Client[];
  isEditing = false;
  clientSelected?: Client;

  nom: string = '';

  constructor(private clientsService: ClientsService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    this.clientsService.getPaginatorClients(0, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pageNext() {
    this.clientsService.getPaginatorClients(++this.page, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      this.isButtonPreviousDisabled = false;

      if (data.last) {
        this.isButtonNextDisabled = true;
        this.isButtonPreviousDisabled = false;
      }
    });
  }

  pagePrevious() {
    this.clientsService.getPaginatorClients(--this.page, 5, 'nom').subscribe((data: any) => {
      this.clients = data.content;
      this.isButtonNextDisabled = false;

      if (data.first) {
        this.isButtonNextDisabled = false;
        this.isButtonPreviousDisabled = true;
      }
    });
  }

  onSearch(value: any) {
    if (value.nom === '') {
      this.alertComponent?.show(AlertType.error, 'Veuillez saisir un nom');
    } else {
      this.alertComponent?.hide();
      this.clientsService.searchClients(value.nom).subscribe((data: any) => {
        this.clients = data;
      });
    }
  }

  onNewClient() {
    //this.router.navigateByUrl('/newClient');
    this.isEditing = false;

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

  voir() {
    alert(this.clientSelected);
  }

  openDeleteModal(c: Client) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce client ?');
    this.nom = c.nom;
    this.showModal();
    this.clientSelected = c;
  }

  onDelete() {
    if (this.clientSelected === undefined) return;

    this.clientsService.deleteClient(this.clientSelected).subscribe({
      next: data => {
        if (this.clientSelected === undefined) return;
        const index = this.clients?.indexOf(this.clientSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Client ' + this.clientSelected.nom + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.clients?.splice(index, 1);
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

  editClient(c: Client) {
    this.isEditing = true;
    this.clientSelected = c;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onEdit(c: Client) {
    this.router.navigateByUrl('/editClient/' + c.id);
  }
}
