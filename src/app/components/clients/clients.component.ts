import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { last, timeout } from 'rxjs';
import { AlertComponent } from '../tools/alert/alert.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  clients?: Client[];

  nom: string = '';

  constructor(private clientsService: ClientsService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    this.clientsService
      .getPaginatorClients(0, 5, 'nom')
      .subscribe((data: any) => {
        this.clients = data.content;        
        this.page = data.number;

        if (data.last) this.isButtonNextDisabled = true;
        if (data.first) this.isButtonPreviousDisabled = true;
      });
    }

  pageNext() {
    this.clientsService
      .getPaginatorClients(++this.page, 5, 'nom')
      .subscribe((data: any) => {
        this.clients = data.content;
        if (data.last) {
          this.isButtonNextDisabled = true;
          this.isButtonPreviousDisabled = false;
        }
      });
  }

  pagePrevious() {
    this.clientsService
      .getPaginatorClients(--this.page, 5, 'nom')
      .subscribe((data: any) => {
        this.clients = data.content;

        if (data.first) {
          this.isButtonNextDisabled = false;
          this.isButtonPreviousDisabled = true;
        }
      });
  }

  onSearch(value: any) {
    this.clientsService.searchClients(value.nom).subscribe((data: any) => {
      this.clients = data;
    });
  }

  onNewClient() {
    this.router.navigateByUrl('/newClient');
  }

  showModal() {
    if (this.deleteModal) {
      this.deleteModal.nativeElement.showModal();
    }
  }

  clientToDelete?: Client;
  openDeleteModal(c: Client) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce client ?');
    this.nom = c.nom;
    this.showModal();
    this.clientToDelete = c;
    /*
    if (v) {
      this.clientsService.deleteClient(c).subscribe({
        next: (data) => {
          this.onSearch(c);
          const index = this.clients?.indexOf(c, 0);

          alert('index = ' + index);
          if (!(index === undefined) && index > -1) {
            this.clients?.splice(index, 1);
          }
        },
        error: (err) => {
          alert(err.headers.get('error'));
        },
      });
    }
    */
  }

  onDelete() {
    if(this.clientToDelete === undefined) return;

    this.clientsService.deleteClient(this.clientToDelete).subscribe({
      next: (data) => {
        if(this.clientToDelete === undefined) return;
        const index = this.clients?.indexOf(this.clientToDelete, 0);

        //alert('index = ' + index);
        this.alertComponent?.show('ok', 'Client ' + this.clientToDelete.nom + ' supprimé');
        if (!(index === undefined) && index > -1) {
          this.clients?.splice(index, 1);
        }
      },
      error: (err) => {
        this.alertComponent?.show('error', err.headers.get('error'));
      },
    });
    setTimeout(() => {
      this.alertComponent?.hide();
    }, 5000);
  }
  onEdit(c: Client) {}
}
